


ManyModel = LinkableModel.extend();


LinkableModel.prototype.registerLinkableType = function (model, type) {
    model.prototype._objectType = type;
    LinkableTypes[type] = model.prototype._collection;
};

addLinkSchema = function() {
  var addSchema = function(model) {
    model.appendSchema({
      "links" : {
        type : Object,
        optional : true,
        autoform: {
          type: "hidden",
        },
      }
    });
  };

  var calledCollections = [];
  return function(model) {
      if(!_.contains(calledCollections, model.collection._name)) {
        addSchema(model);
        calledCollections.push(model.collection._name);
      } else {
        console.log("Already called");
      }
  }
}();

addMethodToModel = function(model, prefix, type, func) {
	var methodName = prefix + type;
	var methods = {};
	methods[methodName] = func;
	model.methods(methods);
}

addLinkToModel = function(model, linkID, schemaString) {
    var query = {};
    query[schemaString] = linkID;
    model.update({$addToSet : query});
}

removeLinkToModel = function(model, linkID, schemaString) {
  var query = {};
  query[schemaString] = linkID;
  model.update({$pull: query});
}

configureLinkableType = function(collection, model, type) {
  addLinkSchema(collection);
  var schemaString = "links." + type;
    var schemaObject = {};
    schemaObject[schemaString] = {
	    type : [String],
      regEx:SimpleSchema.RegEx.Id,
      autoform: {omit: true}
    };
    collection.appendSchema(schemaObject);
	var upperCaseString = type.charAt(0).toUpperCase() + type.slice(1);

  //add
	addMethodToModel(collection, 'add', upperCaseString, function(linkID){
	   addLinkToModel(this, linkID, schemaString);
  });

  //link
  addMethodToModel(collection, 'link', upperCaseString, function(linkID){
    addLinkToModel(this, linkID, schemaString);
    var that = this;
    model.collection.find(linkID).forEach(function(linkedModel){
      var linkedSchemaString = 'links.' +  that._objectType;
      addLinkToModel(linkedModel, that._id, linkedSchemaString);
    });
  });

  //unlink
  addMethodToModel(collection, 'unlink', upperCaseString, function(linkID){
    removeLinkToModel(this, linkID, schemaString);
    var that = this;
    model.collection.find(linkID).forEach(function(linkedModel){
      var linkedSchemaString = 'links.' +  that._objectType;
      removeLinkToModel(linkedModel, that._id, linkedSchemaString);
    });
  });

  //get
	addMethodToModel(collection, 'getLinked', upperCaseString, function(){
    if (typeof this.links != 'undefined') {
  		return LinkableModel.getCollectionForRegisteredType(type).find({
        _id : {$in : this.links[type]}});
    }else {
      throw new Meteor.Error("no-links",
      "There is no links for this model");
    }
	});

  //remove
  addMethodToModel(collection, 'remove', upperCaseString, function(linkID){
    var query = {};
		query[schemaString] = [linkID];
		this.update({$pullAll : query});
	});
}

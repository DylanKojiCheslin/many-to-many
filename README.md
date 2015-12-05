# ManyToManyModels

many-to-many is a Meteor Package allowing many to many data-model relationships.

##Installation
```
meteor add dylankoji:many-to-many
```

##Creating a collection

```
Author = ManyModel.extendAndSetupCollection("author");
```

You may want to make a global reference to the backing collection of the model.

```
AuthorCollection = Author.collection;
```

##Registering the collection you want to link

```
Author.registerLinkableType(Book, "book");
configureLinkableType(Author, Book, "book");
```

##Adding a schema for the model

You can optionally attach a SimpleSchema to the model

```
Author.appendSchema({
  "givenName":{
      type: String,
      max: 30
   },
   "famlyName":{
     type: String,
     max: 30
   },
   "middleName":{
     type: String,
     max: 30,
     optional: true
   },
});
```


##Functions of the ManyModel

The ManyModel dynamically creates functions for registered Types of models.
All the functions that take a paramiter currntly take a Mongo \_id.

ManyModel.add\[type](otherModel.\_id) : Links a model instance to another
model instance. This is a one way linking.

ManyModel.remove\[type](otherModel.\_id) : Removes the link the other model
instance.

ManyModel.link\[type](otherModel.\_id) : Links a model instance to another
model instance and links the second model to the first. Both must be registered
and configured to each other. This is a Two way linking.

 Ex:
 ```
Author.registerLinkableType(Book, "book");
configureLinkableType(Author, Book, "book");

Book.registerLinkableType(Author, "author");
configureLinkableType(Book, Author, "author");
 ```
 ManyModel.getLinked\[type]() : Returns a cursor of all the models of that type
 that are linked to this instance of ManyModel.

##how to use the functions
In a data context such a template helper or an event you can use "this":
```
this.addBook(someBook.\_id);
this.removeBook(someBook.\_id);
this.linkBook(someBook.\_id);
this.getLinkedBook(someBook.\_id);
```

Outside a data contest find and reference:
```
var smartyPants = AuthorCollection.findOne()
smartyPants.addBook(someBook.\_id)
smartyPants.linkBook(someBook.\_id);
smartyPants.removeBook(someBook.\_id)
smartyPants.getLinkedBook()
```

##Thanks

I want to give credit and thanks to cbranch101 for doing nearly all the coding
for the initial version of this package.

In addition to being a great programmer he is also a great person.

https://github.com/cbranch101

## References

an example app is available at:
https://github.com/DylanKojiCheslin/manybooksmanyauthors

this package is build upon copleykj:socialize-linkable-model:
https://github.com/copleykj/socialize-linkable-model

the schema are a part of the SimpleSchema package from aldeed
https://github.com/aldeed/meteor-simple-schema

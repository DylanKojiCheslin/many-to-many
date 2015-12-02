Package.describe({
    name: "dylankoji:many-to-many",
    summary: "A package making linking of many models with many other models possible",
    version: "1.0.0",
    git: "https://github.com/DylanKojiCheslin/many-to-many",
    documentation: "README.md"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.1");
    api.use("socialize:linkable-model@0.2.1");
    api.imply("socialize:linkable-model");
    api.addFiles(["many-to-many-models.js"],['client', 'server']);
    api.export(["ManyModel"]);
    api.export(["configureLinkableType"]);
});

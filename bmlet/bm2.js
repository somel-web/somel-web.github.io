webix.ui({
    view:"window", 
    move:true,
    head:"DataTable", 
    left:100, top:100,
    body:{
      view:"iframe", 
      id:"frame-body", 
      src:"//docs.webix.com/samples/80_docs/data/pageA.html"
    }
  }).show();
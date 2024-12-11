webix.ui({
  view: "window",
  move: true,
  head: "DataTable",
  left: 100, top: 100,
  body: {
    view: "iframe",
    id: "frame-body",
    src: "https://www.lemonde.fr/"
  }
}).show();
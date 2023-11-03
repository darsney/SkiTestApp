// hardcoded stuff, this is how we load the spreadsheet
var spreadsheetId = "1vkTGSLJ44tqfqSJ_fSlvtikk3Op8F62OL8zocz5TnJc";
var sheetName = "Form Responses 1";
var apiKey = "AIzaSyBY4Wi9SHXWr5kIO4meXu2bkB9zcrKcuFA";
var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?alt=json&key=${apiKey}`;

var ViewModel = function () {
  var self = this;

  // bunch of variables you will need later, named appropriately
  var emailColumnIndex = -1,
    sheetRows = [],
    columnHeaders = [];
  self.uniqueEmails = ko.observableArray([]);
  self.selectedEmail = ko.observable("");
  self.valuePivot = ko.observable("ski");
  self.skisByAttribute = ko.observable({});
  self.thisUsersSkis = ko.observableArray([]);
  self.initComplete = ko.observable(false);

  // first things first, load the spreadsheet with a get request
  $.get(url, (sheetData) => {
    sheetRows = sheetData.values;
    columnHeaders = sheetRows[0];
    emailColumnIndex = columnHeaders.indexOf("Email Address");

    // extract unique emails
    var uniqueEmailAdresses = new Set();
    for (var i = 1; i < sheetRows.length; i++) {
      uniqueEmailAdresses.add(sheetRows[i][emailColumnIndex]);
    }
    self.uniqueEmails(Array.from(uniqueEmailAdresses));
    self.initComplete(true);
  });

  // skis by attribute is a mapping of skis to attribute values
  // it is computed whenever the user email is changed
  ko.computed(() => {
    var email = self.selectedEmail();
    var thisUsersRows = sheetRows.filter(
      (row) => row[emailColumnIndex] === email
    );
    var allValidAttributes = columnHeaders.filter(
      (header) =>
        header !== "Email Address" && header !== "Timestamp" && header !== "Ski"
    );
    var skisByAttribute = {};

    var skiColumnIndex = columnHeaders.indexOf("Ski");
    thisUsersRows.forEach((row) => {
      skisByAttribute[row[skiColumnIndex]] = {};
    });

    allValidAttributes.forEach((attr) => {
      var attrIndex = columnHeaders.indexOf(attr);
      thisUsersRows.forEach((row) => {
        skisByAttribute[row[skiColumnIndex]][attr] = row[attrIndex];
      });
    });

    self.thisUsersSkis(Object.keys(skisByAttribute));
    self.skisByAttribute(ko.mapping.fromJS(skisByAttribute));
  });

  self.attributesBySki = ko.computed(() => {});
};

ko.options.deferUpdates = true;
ko.applyBindings(new ViewModel()); // this initializes knockout to bind to the js variables to the page

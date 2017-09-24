var bodyClassObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (isCardDetailPage()) {
      setCardIdInDetail();
    }
  });
});

var config = {
  attributes: true,
  attributeFilter: ['class']
};
bodyClassObserver.observe(getBody(), config);

function isCardDetailPage() {
  var body = getBody();
  return body.className.includes("body-board-view") && body.className.includes("window-up");
}

function setCardIdInDetail() {
  var idRegex = /\/c\/.*\/(\d+)-.*/;
  var results = idRegex.exec(document.location.pathname);
  var id = results[1];
  var cardTitle = document.getElementsByClassName("window-header")[0];
  cardTitle.setAttribute("data-card-id", "#" + id);
}

function getBody() {
  return document.getElementsByTagName('body')[0];
}
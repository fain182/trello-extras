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

// Card counter functionality
var updateTimeout;

function updateCardCounts() {
  var lists = document.querySelectorAll('[data-testid="list"]');

  lists.forEach(function(list) {
    var listHeader = list.querySelector('[data-testid="list-header"]');
    if (!listHeader) return;

    var cards = list.querySelectorAll('[data-testid="list-card"]');
    var cardCount = cards.length;

    // Look for existing counter or create new one
    var counter = listHeader.querySelector('.trello-extras-card-count');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'trello-extras-card-count';

      // Find the title span inside the button and insert badge inside it
      var listName = listHeader.querySelector('[data-testid="list-name"]');
      if (listName) {
        var button = listName.querySelector('button');
        if (button) {
          // Find the span with the title text inside the button
          var titleSpan = button.querySelector('span');
          if (titleSpan) {
            // Insert inside the title span, at the end
            titleSpan.appendChild(counter);
          } else {
            button.appendChild(counter);
          }
        } else {
          listName.appendChild(counter);
        }
      } else {
        listHeader.appendChild(counter);
      }
    }

    // Only update if changed
    var newText = cardCount.toString();
    if (counter.textContent !== newText) {
      counter.textContent = newText;
    }
  });
}

// Debounced update function to avoid too many calls
function scheduleUpdate() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(updateCardCounts, 100);
}

// Observe DOM changes to update card counts
var boardObserver = new MutationObserver(function(mutations) {
  // Only update if we detect relevant changes
  var shouldUpdate = false;
  for (var i = 0; i < mutations.length; i++) {
    var mutation = mutations[i];
    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
      shouldUpdate = true;
      break;
    }
  }

  if (shouldUpdate) {
    scheduleUpdate();
  }
});

// Start observing when board is loaded
function initCardCounter() {
  var boardRoot = document.getElementById('trello-board-root');
  if (boardRoot) {
    // Observe only the lists container, not the entire board
    var listsContainer = boardRoot.querySelector('[data-testid="lists"]');
    if (listsContainer) {
      boardObserver.observe(listsContainer, {
        childList: true,
        subtree: true
      });
      updateCardCounts();
    } else {
      setTimeout(initCardCounter, 500);
    }
  } else {
    // Retry if board not loaded yet
    setTimeout(initCardCounter, 500);
  }
}

// Initialize card counter
initCardCounter();
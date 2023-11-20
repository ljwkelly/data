let inputElement;
let saveButton;
let displayElement;
let gistId;

function setup() {
  noCanvas();

  // Create input element
  inputElement = createInput('Type something...');
  inputElement.changed(saveText);

  // Create save button
  saveButton = createButton('Save');
  saveButton.mousePressed(saveText);

  // Create display element
  displayElement = createP('');

  // Load saved text on startup
  loadText();
}

function saveText() {
  // Save text to GitHub Gist
  let textToSave = inputElement.value();

  let data = {
    description: 'OpenProcessing Saved Text',
    public: true,
    files: {
      'savedText.txt': {
        content: textToSave,
      },
    },
  };

  let method;
  let url;

  if (gistId) {
    // Update existing Gist
    method = 'PATCH';
    url = `https://api.github.com/gists/${gistId}`;
  } else {
    // Create new Gist
    method = 'POST';
    url = 'https://api.github.com/gists';
  }

  httpDo(
    url,
    method,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    function (response) {
      let json = JSON.parse(response);
      gistId = json.id;
      displayElement.html('Saved Text: ' + textToSave);
    }
  );
}

function loadText() {
  // Load saved text from GitHub Gist
  if (gistId) {
    let url = `https://api.github.com/gists/${gistId}`;

    httpDo(
      url,
      'GET',
      function (response) {
        let json = JSON.parse(response);
        if (json.files && json.files['savedText.txt']) {
          let savedText = json.files['savedText.txt'].content;
          inputElement.value(savedText);
          displayElement.html('Saved Text: ' + savedText);
        }
      }
    );
  }
}

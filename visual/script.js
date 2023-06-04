// Function to display the selected image
function displayImage() {
    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
  
      // Read the image file
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          // Display the selected image
          var imageContainer = document.getElementById('imageContainer');
          imageContainer.innerHTML = '';
          imageContainer.appendChild(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Function to process the selected image
  function processImage() {
    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
  
      // Read the image file
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          // Create a canvas element to work with the image
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
  
          // Convert the image to base64 data URL
          var imageDataURL = canvas.toDataURL();
  
          // Perform OCR on the image using Tesseract.js
          Tesseract.recognize(imageDataURL)
            .then(function(result) {
              console.log(result);
              var textResult = result.data.text;
              console.log(textResult);
  
              // Display the OCR result
              var resultContainer = document.getElementById('resultContainer');
              resultContainer.innerHTML = textResult.replace(/\n/g, "<br>");
            })
            .catch(function(error) {
              console.error('Error processing image:', error);
            });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Attach event listener to the image input
  document.getElementById('imageInput').addEventListener('change', displayImage);
  
  // Attach event listener to the process button
  document.getElementById('processButton').addEventListener('click', processImage);
  
  // Function to copy the text from the resultContainer to the clipboard
function copyResultContainer() {
    var resultContainer = document.getElementById('resultContainer');
    console.log(resultContainer.innerHTML);
    var textToCopy = resultContainer.innerHTML.replace(/<br>/g, '\n');
    console.log(textToCopy);
  
    // Create a temporary textarea element to hold the text
    var textarea = document.createElement('textarea');
    textarea.value = textToCopy;
  
    // Append the textarea to the document
    document.body.appendChild(textarea);
  
    // Select the text in the textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
  
    // Copy the selected text to the clipboard
    document.execCommand('copy');
  
    // Remove the textarea from the document
    document.body.removeChild(textarea);
  
    // Show a notification or perform any other action
    alert('Text copied to clipboard!');
  }
  
  // Attach event listener to the copy button
  document.getElementById('copyButton').addEventListener('click', copyResultContainer);
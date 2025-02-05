window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    let davisPalette = ['#000000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#808080', '#400000', '#C00000', '#408000', '#C08000', '#400080', '#C00080', '#408080', '#C08080', '#004000', '#804000', '#00C000', '#80C000', '#004080', '#804080', '#00C080', '#80C080', '#404000', '#C04000', '#40C000', '#C0C000', '#404080', '#C04080', '#40C080', '#C0C080', '#000040', '#800040', '#008040', '#808040', '#0000C0', '#8000C0', '#0080C0', '#8080C0', '#400040', '#C00040', '#408040', '#C08040', '#4000C0', '#C000C0', '#4080C0', '#C080C0', '#004040', '#804040', '#00C040', '#80C040', '#0040C0', '#8040C0', '#00C0C0', '#80C0C0', '#404040', '#C04040', '#40C040', '#C0C040', '#4040C0', '#C040C0', '#40C0C0', '#C0C0C0', '#200000', '#A00000', '#208000', '#A08000', '#200080', '#A00080', '#208080', '#A08080', '#600000', '#E00000', '#608000', '#E08000', '#600080', '#E00080', '#608080', '#E08080', '#204000', '#A04000', '#20C000', '#A0C000', '#204080', '#A04080', '#20C080', '#A0C080', '#604000', '#E04000', '#60C000', '#E0C000', '#604080', '#E04080', '#60C080', '#E0C080', '#200040', '#A00040', '#208040', '#A08040', '#2000C0', '#A000C0', '#2080C0', '#A080C0', '#600040', '#E00040', '#608040', '#E08040', '#6000C0', '#E000C0', '#6080C0', '#E080C0', '#204040', '#A04040', '#20C040', '#A0C040', '#2040C0', '#A040C0', '#20C0C0', '#A0C0C0', '#604040', '#E04040', '#60C040', '#E0C040', '#6040C0', '#E040C0', '#60C0C0', '#E0C0C0', '#002000', '#802000', '#00A000', '#80A000', '#002080', '#802080', '#00A080', '#80A080', '#402000', '#C02000', '#40A000', '#C0A000', '#402080', '#C02080', '#40A080', '#C0A080', '#006000', '#806000', '#00E000', '#80E000', '#006080', '#806080', '#00E080', '#80E080', '#406000', '#C06000', '#40E000', '#C0E000', '#406080', '#C06080', '#40E080', '#C0E080', '#002040', '#802040', '#00A040', '#80A040', '#0020C0', '#8020C0', '#00A0C0', '#80A0C0', '#402040', '#C02040', '#40A040', '#C0A040', '#4020C0', '#C020C0', '#40A0C0', '#C0A0C0', '#006040', '#806040', '#00E040', '#80E040', '#0060C0', '#8060C0', '#00E0C0', '#80E0C0', '#406040', '#C06040', '#40E040', '#C0E040', '#4060C0', '#C060C0', '#40E0C0', '#C0E0C0', '#202000', '#A02000', '#20A000', '#A0A000', '#202080', '#A02080', '#20A080', '#A0A080', '#602000', '#E02000', '#60A000', '#E0A000', '#602080', '#E02080', '#60A080', '#E0A080', '#206000', '#A06000', '#20E000', '#A0E000', '#206080', '#A06080', '#20E080', '#A0E080', '#606000', '#E06000', '#60E000', '#E0E000', '#606080', '#E06080', '#60E080', '#E0E080', '#202040', '#A02040', '#20A040', '#A0A040', '#2020C0', '#A020C0', '#20A0C0', '#A0A0C0', '#602040', '#E02040', '#60A040', '#E0A040', '#6020C0', '#E020C0', '#60A0C0', '#E0A0C0', '#206040', '#A06040', '#20E040', '#A0E040', '#2060C0', '#A060C0', '#20E0C0', '#A0E0C0', '#606040', '#E06040', '#60E040', '#E0E040', '#6060C0', '#E060C0', '#60E0C0', '#E0E0C0'];    

    function hexToRgb(hex) {
      // Remove the hash symbol if it exists
      hex = hex.replace(/^#/, '');

      // If only 3 characters are provided, double each character
      if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      // Convert the characters to numbers
      let num = parseInt(hex, 16);

      // Get the red, green, and blue values
      let r = num >> 16;
      let g = (num >> 8) & 255;
      let b = num & 255;

      return [r, g, b];
    }

    function getColorForNumber(number, palette) {
    // Use the modulo operator to ensure we loop back around to the start
    // of the palette if our number is larger than the palette size
    let colorIndex = number % palette.length;
    // console.log(colorIndex, number, palette.length);

    return hexToRgb(palette[colorIndex]);
    }

    function drawImage(targetCtx, maskImage, highlightedObject) {
      const imgData = targetCtx.createImageData(mask_canvas.width, mask_canvas.height);
      const len = imgData.data.length;

    let color = getColorForNumber(highlightedObject, davisPalette);

      for (let i = 0; i < len; i += 4) {
        const x = (i / 4) % mask_canvas.width;
        const y = Math.floor(i / 4 / mask_canvas.width);
        const object = maskImage[y][x];
        if (object === highlightedObject) {
          imgData.data[i] = color[0];
          imgData.data[i + 1] = color[1];
          imgData.data[i + 2] = color[2];
          imgData.data[i + 3] = 200; // full opacity
        } else {
          imgData.data[i] = 255;
          imgData.data[i + 1] = 255;
          imgData.data[i + 2] = 255;
          imgData.data[i + 3] = 50; // partial opacity
        }
      }
      targetCtx.putImageData(imgData, 0, 0);
    }
 
    // Real Robot Bar Chart
    var trace1 = {
      x: ['Pick Place Cup', 'Stamp The Paper', 'Take the Mug', 
      'Put The Mug On The Coaster', 'Roll The Stamp'],
      y: [90, 80, 90, 100, 70],
      name: 'Canonical',
      type: 'bar',
      marker: {
        color: '#007FA1'
      }
    };

    var trace2 = {
      x: ['Pick Place Cup', 'Stamp The Paper', 'Take the Mug', 
      'Put The Mug On The Coaster', 'Roll The Stamp'],
      y: [80, 60, 70, 70, 60],
      name: 'Camera-Shift',
      type: 'bar',
      marker: {
        color: '#7BDCB5'
      }
    };

    var trace3 = {
      x: ['Pick Place Cup', 'Stamp The Paper', 'Take the Mug', 
      'Put The Mug On The Coaster', 'Roll The Stamp'],
      y: [93.0, 87.0, 77.0, 77.0, 67.0],
      name: 'BackGround-Change',
      type: 'bar',
      marker: {
        color: '#00D084'
      }
    };

    var trace4 = {
      x: ['Pick Place Cup', 'Stamp The Paper', 'Take the Mug', 
      'Put The Mug On The Coaster', 'Roll The Stamp'],
      y: [83.0, 78.0, 72.0, 83.0, 56.0],
      name: 'New-Object',
      type: 'bar',
      marker: {
        color: '#FF5A5F'
      }
    };

    var data = [trace1, trace2, trace3, trace4];

    var layout = {
      barmode: 'group',
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      y: -0.2,
      xanchor: 'center',
      yanchor: 'top',
      // title: ' Success rates (%) of ORION in realrobot tasks.',        
      showarrow: false,
      xaxis: {
        tickfont: {
          size: 20, 
          family: 'Arial', 
          color: 'black',
          weight: 'bold' 
        }
      }
    };

    // Plotly.newPlot('real-robot-results-div', data, layout);
    // Real Robot Bar Charts End

    // // slick
    // $('.example-slick').slick({
    //   dots: true,
    //   slidesToScroll: 1,
    //   slidesToShow: 1,
    //   // vertical: true,
    //   // verticalSwiping: true,
    //   // centerMode: true,
    //   // centerPadding: '60px',
    //   // slidesToShow: 1,
    //   // responsive: [
    //   //   {
    //   //     breakpoint: 768,
    //   //     settings: {
    //   //       arrows: false,
    //   //       centerMode: true,
    //   //       centerPadding: '40px',
    //   //       slidesToShow: 3
    //   //     }
    //   //   },
    //   //   {
    //   //     breakpoint: 480,
    //   //     settings: {
    //   //       arrows: false,
    //   //       centerMode: true,
    //   //       centerPadding: '40px',
    //   //       slidesToShow: 1
    //   //     }
    //   //   }
    //   // ]
    // });
    $('.example-slick').slick({
      dots: true,
      infinite: true,
      // speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      // vertical:true,
      arrows: true,
      adaptiveHeight: true,
      // centerMode: true,
    });
    $('.robot-one-video-slick').slick({
      dots: true,
      infinite: true,
      // speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      // vertical:true,
      arrows: true,
      adaptiveHeight: true,
      // centerMode: true,
    });
    $('.robot-three-video-slick').slick({
      dots: true,
      infinite: true,
      // speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      // vertical:true,
      arrows: true,
      adaptiveHeight: true,
      // centerMode: true,
    });

    setTimeout(function() {
      $(".initial-show").slideUp("fast", function() {
          // Adjust the arrow for the associated toggle button
          let originalText = $(this).prev('.toggleButton').text().slice(0, -2);
          $(this).prev('.toggleButton').text(originalText  + " ▶");
      });
    }, 3000);

    $(".toggleButton").click(function(){
      // Fetch original text content without the arrow (assuming the arrow takes up 2 characters, including whitespace)
      let originalText = $(this).text().slice(0, -2);
      let contentDiv = $(this).next('.toggleContent');  // Selects the subsequent .toggleContent div

      contentDiv.slideToggle("fast", function() {
          // Change the triangle direction based on the visibility of the content
          if(contentDiv.is(":visible")) {
              $(contentDiv.prev('.toggleButton')).text(originalText + " ▼");
          } else {
              $(contentDiv.prev('.toggleButton')).text(originalText + " ▶");
          }
      });
      return false; // Prevent the default behavior of the anchor
      });
    
  //   $("#toggleButton").click(function(){
  //     let originalText = $(this).text().slice(0, -2);
  //     $("#toggleContent").slideToggle("fast", function() {
  //         // Change the arrow direction based on the visibility of the content
  //         if($("#toggleContent").is(":visible")) {
  //             $("#toggleButton").html(originalText + " ▼");
  //         } else {
  //             $("#toggleButton").html(originalText + " ▶");
  //         }
  //     });
  //     return false; // Prevent the default behavior of the anchor
  // });
})



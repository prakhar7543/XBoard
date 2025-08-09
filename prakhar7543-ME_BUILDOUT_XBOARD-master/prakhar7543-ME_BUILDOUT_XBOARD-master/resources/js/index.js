//import "../data/magazines";c
//console.log(1);
const magazines = [
  "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
  "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
  "https://flipboard.com/@thehindu/sportstarlive-rj3ttinvz.rss"
]
;
async function dataJson(url){
    let conversionToJsonUrl1 = "https://api.rss2json.com/v1/api.json?rss_url="+ url;
    
    let rawDataUrl1 = await fetch(conversionToJsonUrl1);
    let formatDataUrl1 = await rawDataUrl1.json();
    console.log("Rss", formatDataUrl1);
    return formatDataUrl1;
}

//dataJson();

function carousalLayer(uniqueId) {
  return `
  <div id="carouselExampleIndicators${uniqueId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators"></div>
      <div id="carousel-inner${uniqueId}" class="carousel-inner"></div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators${uniqueId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators${uniqueId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
      </button>
  </div>
  `;
}


function showContent(data, accordianContentBox, uniqueId) {
  accordianContentBox.innerHTML = carousalLayer(uniqueId);

  let content = data.items;
  let carouselIndicators = accordianContentBox.querySelector(".carousel-indicators");
  let carousalInner = accordianContentBox.querySelector(`#carousel-inner${uniqueId}`);

  content.forEach((item, index) => {
      let carousalDiv = document.createElement("div");
      let { title } = item;
      let link = item.enclosure?.link || "";
      let { pubDate, description } = item;

      let indicator = document.createElement("button");
      indicator.setAttribute("type", "button");
      indicator.setAttribute("data-bs-target", `#carouselExampleIndicators${uniqueId}`);
      indicator.setAttribute("data-bs-slide-to", index);
      indicator.setAttribute("aria-label", `Slide ${index + 1}`);
      if (index === 0) {
          indicator.classList.add("active");
          indicator.setAttribute("aria-current", "true");
      }
      carouselIndicators.appendChild(indicator);

      carousalDiv.classList.add("carousel-item");
      if (index === 0) carousalDiv.classList.add("active");

      carousalDiv.innerHTML = `
          <div>
              <img src="${link}" alt="picture" class="d-block w-100">
              <div>
                  <h5>${title}</h5>
                  <span>${pubDate}</span>
                  <p>${description}</p>
              </div>
          </div>`;
      carousalInner.appendChild(carousalDiv);
  });
}



async function addRssFeedToDom(magazines) {
  let selectAccordianSection = document.getElementById("accordian-section");
  for (let i = 0; i < magazines.length; i++) {
      try {
          let data = await dataJson(magazines[i]);
          if (!data || !data.items || data.items.length === 0) {
              console.warn(`No items found for magazine: ${magazines[i]}`);
              continue;
          }
          let accordianid = `collapse${i + 1}`;
          let showOnDOMcontent = i === 0 ? "show" : "";
          let { title } = data.feed;

          let createElement = document.createElement("div");
          createElement.setAttribute("class", "contentDiv");
          createElement.setAttribute("id", `content-Div-${i + 1}`);
          createElement.innerHTML = `
          <div class="accordion" id="accordionColor">
              <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${accordianid}" aria-expanded="true" aria-controls="${accordianid}">
                      <h5 class="title-text">${title}</h5>
                  </button>
              </h2>
              <div id="${accordianid}" class="accordion-collapse collapse ${showOnDOMcontent}" data-bs-parent="#accordionExample">
                  <div class="accordion-body" id="accordion-body-${i + 1}">
                  </div>
              </div>
          </div>`;
          selectAccordianSection.append(createElement);

          let accordianContentBox = document.getElementById(`accordion-body-${i + 1}`);
          showContent(data, accordianContentBox, i + 1); // Pass the unique index
      } catch (error) {
          console.error("Error fetching or processing RSS feed:", error);
      }
  }
}



// Call the function
addRssFeedToDom(magazines);








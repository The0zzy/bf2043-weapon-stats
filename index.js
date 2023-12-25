function initWeapon(tagId) {
  let weapon = getAssetTagById(tagId);
  console.log("weapon selected: ", weapon);
  let imgurl = getAssetTagImageUrl(weapon);
  document.getElementById(
    "weapon-preview"
  ).style.backgroundImage = `url('${imgurl}')`;
  attachments = getAssetTagByName(weapon.name + " - ");
}

function initWeaponCategories() {
  document.getElementById("weapons").innerHTML = "";
  weaponTag = portalSettings.blueprint[0].availableGameData.assetCategories.rootTags.find(
    (element) => element.tagId == "Weapons"
  );
  weaponTag.childrenTags.forEach((childTag) => {
    let assetTag = getAssetTagById(childTag);
    console.log("asset tag", assetTag);
    if (assetTag.metadata) {
      let weaponCategory = assetTag.metadata.translations[0].localizedText;
      console.log("Weapon Category", childTag, weaponCategory);
      document.getElementById(
        "weapons"
      ).innerHTML += `<optgroup id="${childTag}" label="${weaponCategory}"></optgroup>`;
      for (let index = 0; index < assetTag.childrenTags.length; index++) {
        let weapon = getAssetTagById(assetTag.childrenTags[index]);
        console.log("Weapon", assetTag.childrenTags[index], weapon);
        if (weapon && weapon.metadata && !weapon.childrenTags) {
          document.getElementById(
            assetTag.tagId
          ).innerHTML += `<option value="${assetTag.childrenTags[index]}">${weapon.metadata.translations[0].localizedText}</option>`;
        }
      }
    }
  });
  document.getElementById("weapons").addEventListener("change", (ev) => {
    initWeapon(ev.target.value);
  });
  document.getElementById("weapons").dispatchEvent(new Event("change"));
}

function getAssetTagByName(name) {
  let assetTags =
    portalSettings.blueprint[0].availableGameData.assetCategories.tags;
  return assetTags.filter((element) => element.name.startsWith(name));
}

function getAssetTagImageUrl(assetTag) {
  if (assetTag.metadata.resources) {
    let imgurl = assetTag.metadata.resources.find(
      (element) => element.kind == "image" || element.kind == "webImage"
    ).location.url;
    return imgurl;
  }
  return "";
}

function getAssetTagById(tagId) {
  let assetTags =
    portalSettings.blueprint[0].availableGameData.assetCategories.tags;
  return assetTags.find((element) => element.tagId == tagId);
}

function init() {
  initWeaponCategories();
  document.querySelectorAll(".attachment-cell").forEach((element) => {
    element.addEventListener("click", (ev) => {
      showAttachments(ev.target.id);
    });
  });
  console.log("added event listeners");
}

function showAttachments(attachmentCellId) {
  console.log("show attachment list for ", attachmentCellId);
  let attachmentList = document.querySelector("#attachment-list");
  attachmentList.innerHTML = "";
  let attachmentListSpecific = document.querySelector(
    "#attachment-list-specific"
  );
  attachmentListSpecific.innerHTML = "";
  attachments.forEach((element) => {
    if (
      element.metadata.translations[0].translationId.includes(
        "_" + attachmentCellId
      )
    ) {
      attachmentDiv = document.createElement("div");
      attachmentDiv.setAttribute("class", "attachment-item");
      attachmentDiv.setAttribute("id", element.tagId);
      attachmentDiv.innerHTML = element.metadata.translations[0].localizedText;
      attachmentDiv.style.backgroundImage = `url('${getAssetTagImageUrl(
        element
      )}')`;
      attachmentListSpecific.appendChild(attachmentDiv);
      document.getElementById(element.tagId);
    }
  });
}

const weaponConfigs = [
  {
    id: "ak24-sorrow",
    displayName: "Sorrows AK-24",
    weaponId: "",
    opticId: "",
    barrelId: "",
    munitionId: "",
    underbarrelId: "",
  },
];

let portalSettings = {};

fetch("./portal-settings.json").then((response) => {
  console.log(response);
  response.json().then((parsedData) => {
    portalSettings = parsedData;
    console.log(portalSettings);
    init();
  });
});
console.log(portalSettings);

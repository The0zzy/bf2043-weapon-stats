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
    element.addEventListener("click", showAttachments);
  });
  console.log("added event listeners");
}

function showAttachments() {
  console.log("show attachment list");
  let attachmentList = document.querySelector("#attachment-list");
  attachmentList.innerHTML = "";
  attachments.forEach((element) => {
    attachmentList.innerHTML += `<div class="attachment-item" id="${element.tagId}">${element.metadata.translations[0].localizedText}</div>`;
    document.getElementById(
      element.tagId
    ).style.backgroundImage = `url('${getAssetTagImageUrl(element)}')`;
  });
}

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

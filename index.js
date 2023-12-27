function initWeapon(tagId) {
  let weapon = getAssetTagById(tagId);
  console.log("weapon selected: ", weapon);
  let imgurl = getAssetTagImageUrl(weapon);
  document.getElementById(
    "weapon-preview"
  ).style.backgroundImage = `url('${imgurl}')`;
  resetAttachments();
  document.querySelectorAll(".attachment-cell").forEach((element) => {
    element.addEventListener("click", (ev) => {
      showAttachments(ev.target.id, weapon.name);
    });
  });
  showWeaponStats(weapon.name);
  showWeaponConfigs(tagId);
}

function showWeaponConfigs(weaponId) {
  let applicableConfigs = weaponConfigs.filter(
    (element) => weaponId == element.weaponId
  );
  let configSelection = document.getElementById("weaponConfigs");
  configSelection.innerHTML = "";
  applicableConfigs.forEach((config) => {
    let configOption = document.createElement("option");
    configOption.value = config.id;
    configOption.innerHTML = config.displayName;
    configSelection.appendChild(configOption);
  });
  let configOption = document.createElement("option");
  configOption.value = "custom";
  configOption.innerHTML = "Custom";
  configOption.selected = true;
  configSelection.appendChild(configOption);
  configSelection.addEventListener("change", (e) => {
    applyWeaponConfig(e.target.value);
  });
}

function applyWeaponConfig(configId) {
  let config = weaponConfigs.filter((element) => element.id == configId);
  if (config.length == 1) {
    config = config[0];
    selectAttachment("OPTIC", config.opticId);
    selectAttachment("MUNITION", config.munitionId);
    selectAttachment("UNDERBARREL", config.underbarrelId);
    selectAttachment("BARREL", config.barrelId);
  } else {
    resetAttachments();
  }
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

function getAssetTagsByName(name) {
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
  if (
    damageProfiles != null &&
    portalSettings != null &&
    weaponConfigs != null
  ) {
    initWeaponCategories();
  }
}

function showAttachments(attachmentCellId, weaponName) {
  console.log("show attachment list for ", attachmentCellId);
  let attachmentListSpecific = document.querySelector(
    "#attachment-list-specific"
  );
  attachmentListSpecific.innerHTML = "";
  let attachments = getAssetTagsByName(weaponName + " - ");
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
      attachmentDiv.addEventListener("click", (ev) => {
        selectAttachment(attachmentCellId, ev.target.id);
      });
      attachmentListSpecific.appendChild(attachmentDiv);
      document.getElementById(element.tagId);
    }
  });
}

function selectAttachment(attachmentCellId, attachmentId) {
  console.log(
    "attachment selected for ",
    attachmentCellId,
    " => ",
    attachmentId
  );
  let attachmentTag = getAssetTagById(attachmentId);
  document.getElementById(
    attachmentCellId
  ).style.backgroundImage = `url('${getAssetTagImageUrl(attachmentTag)}')`;
  document.getElementById("attachment-list-specific").innerHTML = "";
}

function resetAttachments() {
  for (const cellId of ["BARREL", "UNDERBARREL", "MUNITION", "OPTIC"]) {
    document.getElementById(cellId).style.backgroundImage = "";
  }
  document.getElementById("attachment-list-specific").innerHTML = "";
}

function showWeaponStats(weaponName) {
  let damageProfile = damageProfiles.filter((element) =>
    element.WeapFileName.endsWith(weaponName)
  );
  let stats = document.getElementById("stats");
  stats.innerHTML = "";
  let statsTable = document.createElement("table");
  if (damageProfile.length == 1) {
    for (const property in damageProfile[0]) {
      statsTable.innerHTML += `<tr><td>${property}</td><td>${damageProfile[0][property]}</td></tr>`;
    }
  } else {
    statsTable.innerHTML = "<tr><td>No data</td></tr>";
  }
  stats.appendChild(statsTable);
}

let weaponConfigs = null;
let portalSettings = null;
let damageProfiles = null;

fetch("./portal-settings.json").then((response) => {
  console.log(response);
  response.json().then((parsedData) => {
    portalSettings = parsedData;
    console.log(portalSettings);
    init();
  });
});

fetch("./bf2042.json").then((response) => {
  console.log(response);
  response.json().then((parsedData) => {
    damageProfiles = parsedData;
    console.log(damageProfiles);
    init();
  });
});

fetch("./weaponConfigs.json").then((response) => {
  console.log(response);
  response.json().then((parsedData) => {
    weaponConfigs = parsedData;
    console.log(weaponConfigs);
    init();
  });
});

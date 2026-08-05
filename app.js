import { legendsData, weaponsData } from "./data.js";

legendsData.forEach(legend => {
    const targetGroup = document.getElementById(legend.classname);

    if (targetGroup) {
        
        const wrapper = document.createElement("div");
        wrapper.className = "legend-wrapper";

        const imgElement = document.createElement("img");
        imgElement.src = legend.imgLink;
        imgElement.alt = legend.name;
        imgElement.id = legend.id;
        imgElement.dataset.active = legend.isActive;
        imgElement.className = "legend-icon";

        const chainElement = document.createElement("img");
        chainElement.src = "./images/chain.png";
        chainElement.alt = "ロックがかかっています"
        chainElement.className = "chain-img"
        wrapper.dataset.active = legend.isActive;


        imgElement.addEventListener("click", () => {
            const nextStatus = imgElement.dataset.active === "true" ? "false" : "true";
            imgElement.dataset.active = nextStatus;
            wrapper.dataset.active = nextStatus;

            legend.isActive = (nextStatus === "true");
            console.log(`${legend.name}の状態: ${nextStatus}`);
        });

        wrapper.appendChild(imgElement);
        wrapper.appendChild(chainElement);
        targetGroup.appendChild(wrapper);
    }
});

const advancedModeSwitch = document.getElementById("advanced-mode-switch");
const advancedSettings = document.getElementById("advanced-setting");
const normalSetting = document.getElementById("normal-setting")

advancedModeSwitch.addEventListener("change", function() {

    if (this.checked) {
        advancedSettings.style.display = "block";
        normalSetting.style.display = "none";
    } else {
        advancedSettings.style.display = "none";
        normalSetting.style.display = "block";
    }


});






function createWeaponHTML(weapon) {
    if (weapon.isCarePackage) {   
        return `
            <div class="weapon-box" id="box-${weapon.id}" data-type="CP">
                <div class="weapon-title">${weapon.name}</div>
                <div class="weapon-settings">
                    <label class="setting-item">
                        <input type="checkbox" class="main-check">
                        <span class="status-mark"></span> メイン
                    </label>
                    <label class="setting-item">
                        <input type="checkbox" class="sub-check">
                        <span class="status-mark"></span> サブ
                    </label>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="weapon-box" id="box-${weapon.id}" data-type="${weapon.type}">
                <div class="weapon-title">${weapon.name}</div>
                <div class="weapon-settings">
                    <label class="setting-item">
                        <input type="checkbox" class="main-check" checked>
                        <span class="status-mark"></span> メイン
                    </label>
                    <label class="setting-item">
                        <input type="checkbox" class="sub-check">
                        <span class="status-mark"></span> サブ
                    </label>
                    <label class="setting-item">
                        <input type="checkbox" class="sling-check">
                        <span class="status-mark"></span> スリング
                    </label>
                </div>
            </div>
        `;
    }
}



function deployWeapon(weapon) {
    let targetId = "";

    if (weapon.isCarePackage) {
        targetId = "weapon-container-CP";
    } else {
        targetId = "weapon-container-" + weapon.type;
    }

    const container = document.getElementById(targetId);
    if (container) {
        const html = createWeaponHTML(weapon);
        container.insertAdjacentHTML("beforeend", html);
    } else {
        console.error("見つからないID:", targetId);
    }
}

weaponsData.forEach(deployWeapon);

//武器種選択
const tabs = document.querySelectorAll(".tab-btn");
const content = document.querySelectorAll(".content");

tabs.forEach((btn, index) => {
    btn.addEventListener("click", () => {

        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        content.forEach(c => c.classList.remove("active"));
        content[index].classList.add("active");
    });
});




//抽選
const startButton = document.getElementById("start");

startButton.addEventListener("click", () => {

    let finalChara = null;
    let finalMain = null;
    let finalSub = null;
    let finalSling = null;


    const charaSwitch = document.getElementById("chara-switch");
    if (charaSwitch.checked === true) {
        const activeLegends = [];
        legendsData.forEach(legend => {
            if (legend.isActive === true) {
                activeLegends.push(legend);
            }
        });

        if (activeLegends.length === 0) {
            console.log("選択されていません");
            return;
        }

        const charaRandomIndex = Math.floor(Math.random() * activeLegends.length);
        
        finalChara = activeLegends[charaRandomIndex]; 
    }


    const weaponSwitch = document.getElementById("weapon-switch");
    const weaponCount = document.querySelector('input[name="weapon-count"]:checked').value;

    function drawUniqueWeapons(array, count) {
        const results = [];
        for (let i=0; i<count; i++) {
            const randomIndex = Math.floor(Math.random() * array.length);
            const selected = array.splice(randomIndex, 1)[0];
            results.push(selected);
        }
        return results;
    }

    function drawRandomWeapons(array, count) {
        const results = [];
        for (let i=0; i<count; i++) {
            const randomIndex = Math.floor(Math.random() * array.length);
            results.push(array[randomIndex]);
        }
        return results;
    }

    if (weaponSwitch.checked === true) {
        if (advancedModeSwitch.checked === false) {//武器こだわりモードが「オフ」の場合

            const noCarePackage = weaponsData.filter(weapon => weapon.isCarePackage === false);
            let selectedWeapons = null;

            if (another.checked === true) {
                selectedWeapons = drawUniqueWeapons(noCarePackage, weaponCount);
            } else if (another.checked === false) {
                selectedWeapons = drawRandomWeapons(noCarePackage, weaponCount);
            }

            if (selectedWeapons) {
                finalMain = selectedWeapons[0] || null;
                finalSub = selectedWeapons[1] || null;
                finalSling = selectedWeapons[2] || null;
            }

        } else {//武器こだわりモードが「オン」の場合
            
            const mainWeapon = [];
            const subWeapon = [];
            const slingWeapon = [];

            allCheckboxes.forEach(box => {
                if (!box.checked) return;
                const weaponBox = box.closest(".weapon-box");
                const weaponId = weaponBox.id.replace("box-","");
                const weaponData = weaponsData.find(w => w.id == weaponId);

                if (box.classList.contains("main-check")) {
                    mainWeapon.push(weaponData);
                } else if (box.classList.contains("sub-check")) {
                    subWeapon.push(weaponData);
                } else if (box.classList.contains("sling-check")) {
                    slingWeapon.push(weaponData);
                }
            });


            finalMain = mainWeapon[Math.floor(Math.random() * mainWeapon.length)] || null;
            finalSub = subWeapon[Math.floor(Math.random() * subWeapon.length)] || null;
            finalSling = slingWeapon[Math.floor(Math.random() * slingWeapon.length)] || null;
        }
    }

    const resultScreen = document.getElementById("result-screen");
    if (resultScreen) {
        
        const charaText = document.getElementById("chara-result-text");
        const charaImg = document.getElementById("chara-result-img"); 

        if (charaText) {
            charaText.textContent = finalChara ? `使用キャラ: ${finalChara.name}` : "キャラ抽選: OFF";
        }


        if (charaImg) {
            if (finalChara && finalChara.imgLink) {
                charaImg.src = finalChara.imgLink;  
                charaImg.style.display = "block"; 
            } else {
                charaImg.src = "";                
                charaImg.style.display = "none";  
            }
        }

        //武器テキストの書き換え
        const mainText = document.getElementById("main-result-text");
        if (mainText) mainText.textContent = finalMain ? `メイン: ${finalMain.name}` : "メイン: --";
        
        const subText = document.getElementById("sub-result-text");
        if (subText) subText.textContent = finalSub ? `サブ: ${finalSub.name}` : "サブ: --";
        
        const slingText = document.getElementById("sling-result-text");
        if (slingText) slingText.textContent = finalSling ? `スリング: ${finalSling.name}` : "スリング: --";

        resultScreen.classList.add("active"); 
    }
});

const resultScreen = document.getElementById("result-screen");
const closeResult = document.getElementById("close-result");
closeResult.addEventListener("click", () => {
    resultScreen.classList.remove("active");
});


const allControlButton = document.querySelectorAll(".category-control button");
const allCheckboxes = document.querySelectorAll(".main-check, .sub-check, .sling-check");

allControlButton.forEach(button => {
    button.addEventListener("click", (event) => {
        const type = event.target.dataset.type;
        const scope = event.target.dataset.scope;
        const action = event.target.dataset.action;

        
        allCheckboxes.forEach(box => {
            
            if (scope === "main" && !box.classList.contains("main-check")) return;
            if (scope === "sub" && !box.classList.contains("sub-check")) return;
            if (scope === "sling" && !box.classList.contains("sling-check")) return;

            const weaponBox = box.closest(".weapon-box");
            const weaponType = weaponBox.dataset.type;


            if (type === "all" && weaponType === "CP") return;
            if (type === "all" || type === weaponType) {
                box.checked = (action === "on");
            }
        });
    });
});




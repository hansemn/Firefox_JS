//bmcount_2c.uc.js , Korrektur für Firefox 139 Nightly, RC_1c, Vereinfacht
//basiert auf Script von BrokenHeart =>
//https://www.camp-firefox.de/forum/thema/136572-nur-die-anzeige-der-ordner-lesezeichenanzahl-in-einer-anderen-farbe-darstellen/?postID=1269879#post1269879
//Release Candidate 1 =>
//https://www.camp-firefox.de/forum/thema/136572-nur-die-anzeige-der-ordner-lesezeichenanzahl-in-einer-anderen-farbe-darstellen/?postID=1270320#post1270320


(function() {

    if (!window.gBrowser)
        return;

    setTimeout(function() {
        setFunction();
    },50);

    //Custom icons ==> in profile/chrome/icons folder
    let ProfilePath = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir, 'chrome', 'icons'));
    let icon1 = "YourFolderIcon.png"        //  Custom  Folder Icon
    let icon2 = "YourLinkIcon.svg"          //  Custom  Link Icon

    function setFunction() {

        const css =`

     /** Basiseinstellungen **/

     #bmContent {
          display: flex !important;
          margin-inline: auto 0 !important; /* Gesamt rechtsbuendig */
          padding-left: 8px;                /* min. Abstand links Alles für enge Popups */
          height: var(--bm_icon_size);      /* Layout passt sich Icon Groesse an, Test */

          /* Icons */
          /* Use Custom Icons, comment to disable => */
          /*--bm_icon_image_1: url("${ProfilePath}/${icon1}");*/
          /*--bm_icon_image_2: url("${ProfilePath}/${icon2}");*/

          /* Use Firefox Icons, comment to disable => */
          --bm_icon_image_1: url("chrome://global/skin/icons/folder.svg");
          --bm_icon_image_2: url("chrome://browser/skin/bookmark-hollow.svg");

          /* Abstand Mitte zwischen Counter #1 Counter #2 */
          --bm_margin_left: 8px;

          /* Abstand zwischen Icon und Ziffer */
          --bm_space: 2px;

          /** Feste Breite der Counter, abhaengig von Anzahl Ziffern/Fontart und Grösse
           -> Anpassen bis Icons untereinander auf gleicher Hoehe **/

          /* Groesse Icons = 16px Firefox Standard */
          --bm_icon_size: 16px;

          /* Breite der Zähler #1/#2 (hier fuer je 2 Ziffern mit Klammern, Systemfont Mac) */
          --bm_width_one: 2.1em;
          --bm_width_two: 2.1em;
     }

     /** Basiseinstellungen Ende **/


     /** Die Counter **/

     /* Counter #1 Ordner */
     #bmContent::before {
          content: attr(data-value1);
          display: flex;
          min-width: fit-content;
          width: var(--bm_width_one);
          padding-inline: calc(var(--bm_icon_size) + var(--bm_space)) 0;
          justify-content: end;
          align-items: center;
          background-image: var(--bm_icon_image_1);
          background-position: center left;
          background-repeat: no-repeat;
          background-size: var(--bm_icon_size);
          /*color: hsl(155, 90%, 50%, 1) !important;*/
          /*fill: hsl(255, 70%, 50%, 1) !important;*/     /* Farben Text / svg Icons aendern */
          }

     /* Counter #2 Links */
     #bmContent::after {
          content: attr(data-value2);
          display: flex;
          min-width: fit-content;
          width: var(--bm_width_two);
          padding-inline: calc(var(--bm_icon_size) + var(--bm_space)) 0;
          align-items: center;
          justify-content: end;
          margin-left: var(--bm_margin_left);
          background-image: var(--bm_icon_image_2);
          background-position: center left;
          background-repeat: no-repeat;
          background-size: var(--bm_icon_size);
          }

     /** Optionale Extras **/

     /* Anpassungen bei Zahl = 0 */

      /* Verstecken/ Verblassen #1 */
      #bmContent[data-value1="[0]"]::before,
      #bmContent[data-value1="0"]::before,
      #bmContent[data-value1="(0)"]::before {
          /*opacity: 0.2;*/
          display: none;
          }

      /* Verstecken/ Verblassen #2 */
      #bmContent[data-value2="[0]"]::after,
      #bmContent[data-value2="0"]::after,
      #bmContent[data-value2="(0)"]::after {
          /*opacity: 0.5;
          display: none;*/
          color: hsl(0, 0%, 50%, 0.5) !important;
          fill: hsl(0, 0%, 50%, 0.5) !important;     /* Farben Deckkraft statt opacity für Performance Test */
          }

      /** Tool zum Testen der Abstände **/
      /*
      #bmContent {
          outline: 1px solid blue;
          outline-offset: 4px;
          }
      #bmContent::after {
          background-image: var(--bm_icon_image_1),linear-gradient(lightgreen, lightgreen) !important;
          background-color: pink;
          }
      #bmContent::before {
          background-image: var(--bm_icon_image_2),linear-gradient(lightblue, lightblue) !important;
          background-color: khaki;
          }
      */
		`;
        const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI('data:text/css,' + encodeURIComponent(css));
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

        let bmbMenu = document.getElementById('bookmarks-menu-button');
        let bookMenu = document.getElementById('bookmarksMenu');
        let persToolBar = document.getElementById('PersonalToolbar');

        if(bmbMenu)
            bmbMenu.addEventListener('popupshowing', onPopupShowing );
        if(bookMenu)-
            bookMenu.addEventListener('popupshowing', onPopupShowing );
        if(persToolBar)
            persToolBar.addEventListener('popupshowing', onPopupShowing );
    }

    function onPopupShowing(aEvent) {
        let popup = aEvent.originalTarget;
        for (let item of popup.children) {
            if (item.localName != 'menu' || item.id?.startsWith('history'))
                continue;
            setTimeout(() => {
              let itemPopup = item.menupopup;
			        itemPopup.hidden = true;
			        itemPopup.collapsed = true;
              itemPopup.openPopup();
              itemPopup.hidePopup();
              let menuitemCount = 0;
              let menuCount = 0;
              for (let subitem of itemPopup.children) {
                if (subitem.classList.contains('bookmark-item') && !subitem.disabled && !subitem.hidden) {
                  if (subitem.localName == 'menuitem') {
                    menuitemCount++;
                  } else if (subitem.localName == 'menu') {
                    menuCount++;
                  }
                }
              }
			        itemPopup.hidden = false;
			        itemPopup.collapsed = false;

              // Eigenes Element für Zaehler
              let bmCounta = item.childNodes[1];
              bmCounta.innerHTML = "";
              let bmContent = document.createElement("bmContent");
              bmContent.id = "bmContent";
              bmCounta.appendChild(bmContent);

              //Zähler Optionen, mit, ohne, eckige, runde Klammern

              //let strCountOut1 = "" + menuCount + "";      //  ohne Klammern
              //let strCountOut1 = "(" + menuCount + ")";    //  runde Klammern
              let strCountOut1 = "[" + menuCount + "]";      //  eckige Klammern
              bmContent.setAttribute('data-value1', strCountOut1);

              //let strCountOut2 = "" + menuitemCount + "";      //  ohne Klammern
              //let strCountOut2 = "(" + menuitemCount + ")";    //  runde Klammern
              let strCountOut2 = "[" + menuitemCount + "]";      //  eckige Klammern
              bmContent.setAttribute('data-value2', strCountOut2);

              // Extra class und Attribut parent; optional
                  //if (bmContent.parentElement) {
              //bmContent.parentElement.classList.add('pfeil');
              //bmContent.parentElement.setAttribute('data-value3', strCountOut1 + strCountOut2);
              //}

            }, 100);
        }
    }

})();

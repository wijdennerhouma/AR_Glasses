var ARLookWidget = (function () {
  //initialisation des config :les bouton
  function ja() {
    console.log(
      "La fonction ja() a été appelée. Réglage du mode en temps réel."
    );
    Sa.mode = ob.realtime;
    Sa.isRT = !0;
    Ca.adjust = document.getElementById("ARLookWidgetAdjust");
    if (Ca.adjust) {
      console.log("Élément d'ajustement trouvé. Initialisation des écouteurs d'événements et des éléments d'interface utilisateur." );
      Ca.adjustNotice = document.getElementById("ARLookWidgetAdjustNotice");
      Ca.adjustExit = document.getElementById("ARLookWidgetAdjustExit");
      Ca.changeModelContainer = document.getElementById(
        "ARLookWidgetChangeModelContainer"
      );
      Ca.buttonResizeCanvas = document.getElementById("buttonResizeCanvas");
      var S = Ca.adjust;
      S && S.addEventListener("click", yb, !1);
      (S = Ca.adjustExit) && S.addEventListener("click", Fb, !1);
      [Ca.adjust, Ca.changeModelContainer, Ca.buttonResizeCanvas].forEach(sa);
    }
    $b.enabled && Wa.do_instantDetection($b.interval, $b.callback);
    jc && (jc(!0), (jc = null));
    console.log("Exécution de la fonction ja() terminée.");
  }
  //injecterStylesCSS
  function na() {
    console.log(
      "La fonction na() a été appelée. Création d'un élément de style et ajout au DOM."
    );
    var S = document.createElement("style");
    S.setAttribute("type", "text/css");
    S.innerHTML =
      "._arlookForceHide { display: none!important }._arlookForceShow { display: revert!important }";
    var V = document.getElementsByTagName("head");
    if (V.length >= 1) {
      console.log("L'élément <style> a été ajouté à l'en-tête de la page.");
      V[0].appendChild(S);
    } else {
      console.log(
        "Aucun en-tête trouvé, ajout de l'élément <style> au corps de la page."
      );
      document.body.appendChild(S);
    }
    console.log("Exécution de la fonction na() terminée.");
  }
  //gestionAffichageElement
  function sa(S) {
    if (S) {
      console.log(
        "La fonction sa() a été appelée. Gestion de l'affichage de l'élément."
      );
      S.classList.remove("_arlookForceHide");
      if ("none" === window.getComputedStyle(S).display) {
        console.log("L'élément était caché, le montrer maintenant.");
        S.classList.add("_arlookForceShow");
      }
    }
  }

  //cacherElement
  function Pa(S) {
    if (S) {
      console.log(
        "La fonction Pa() a été appelée. Gestion de l'affichage de l'élément."
      );
      S.classList.add("_arlookForceHide");
      S.classList.remove("_arlookForceShow");
    }
  }

  //appliquerStyles
  function wa(S, V) {
    if (S) {
      console.log(
        "La fonction wa() a été appelée. Modification des styles de l'élément S :",
      );
      for (var ua in V) {
        console.log("  wa : Modification du style", ua, "avec la valeur", V[ua]);
        S.style[ua] = V[ua];
      }
    }
  }

  //dimensionsElement
  function qb(S) {
    if (!S) {
      console.log("qb: Aucun élément spécifié. Largeur et hauteur renvoyées à 0.");
      return { width: 0, height: 0 };
    }
    S = S.getBoundingClientRect();
    console.log("qb: Obtention des dimensions de l'élément : S");
    return { width: S.width, height: S.height };
  }

  //chargerFichierJSON
  function va(S) {
    console.log("Fonction va : Début de la requête GET vers S");
    return new Promise(function (V, ua) {
      var Ga = new XMLHttpRequest();
      Ga.open("GET", S, !0);
      Ga.onreadystatechange = function () {
        if (4 === Ga.readyState)
          if (200 === Ga.status || 0 === Ga.status)
            try {
              var Ka = JSON.parse(Ga.responseText);
              console.log("Fonction va : Réponse reçue :");
              V(Ka);
            } catch (vb) {
              console.error("Fonction va : Erreur lors du parsing JSON :");
              ua("INVALID JSON");
            }
          else {
            console.error("Fonction va : Erreur HTTP " );
            ua("HTTP ERROR " + Ga.status);
          }
      };
      Ga.send();
    });
  }

  function Ja(S, V) {
    console.log("Function Ja: Fetching data from:", S);
    return fetch(S, { method: "GET", mode: "cors", cache: "no-cache" })
      .then(function (ua) {
        console.log("Function Ja: Response received.");
        return ua.json();
      })
      .then(function (ua) {
        var Ga = ua.tweaker;
        console.log("Function Ja: Processing data:", ua);
        return Ua(ua.modelURL, V).then(function () {
          console.log("Function Ja: Data processing complete.");
          Wc(Ga, null);
        });
      });
  }

  //charge un modèle à partir d'une URL spécifiée
  function Ua(S, V) {
    console.log("Fonction Ua: Début de la promesse.");
    return new Promise(function (ua, Ga) {
      va(S)
        .then(function (Ka) {
          console.log("Fonction Ua: Promesse résolue avec succès.");
          Xc(V, Ka, ua);
        })
        .catch(function (error) {
          console.error("Fonction Ua: Erreur lors de la promesse");
          Ga(error);
        });
    });
  }

  function eb() {
    console.log("Fonction eb: Début de la désactivation du chargement.");
    wb.toggle_loading(!1);
    Sa.mode = ob.realtime;
    console.log("Fonction eb: Mode mis à 'temps réel'.");
    sb("INVALID_SKU");
    console.log("Fonction eb: Signalisation d'un SKU invalide.");
  }

  function sb(S) {
    if (Hc.error) {
      Hc.error(S);
    } else {
      console.log("ERREUR:", S);
    }
  }

  function Sb(S) {
    var V = qb(Ca.container),
      ua = Math.abs(fb.displayWidth - V.width),
      Ga = Math.abs(fb.displayHeight - V.height);
    if (!S && 1 >= ua && 1 >= Ga && 1 === fb.oFactor) {
      console.log(
        "INFO dans ARLookWidget.resize : différence de résolution trop petite, abandon de la redimension"
      );
    } else {
      fb.displayWidth = V.width;
      fb.displayHeight = V.height;
      fb.oFactor = 1;
      console.log(
        "INFO dans ARLookWidget.resize : largeur = " +
          fb.displayWidth.toString() +
          " hauteur = " +
          fb.displayHeight.toString() +
          " oFactor = " +
          (1).toString()
      );
      fb.cvWidth = Math.round(1 * fb.displayWidth);
      fb.cvHeight = Math.round(1 * fb.displayHeight);
      wa(Ca.cv, {
        width: fb.displayWidth.toString() + "px",
        height: fb.displayHeight.toString() + "px",
      });
      Ca.cv.width = fb.cvWidth;
      Ca.cv.height = fb.cvHeight;
      if (Wa) {
        if (Sa.mode === ob.notLoaded) {
          Wa.set_size(fb.cvWidth, fb.cvHeight, !1);
        } else {
          Wa.onLoad(function () {
            Wa.resize(fb.cvWidth, fb.cvHeight, !1, S);
          });
        }
      }
    }
  }

  function yb() {
    [Ca.adjust, Ca.changeModelContainer, Ca.buttonResizeCanvas].forEach(Pa);
    Sa.mode = ob.adjust;
    [Ca.adjustNotice, Ca.adjustExit].forEach(sa);
    Ca.cv.style.cursor = "move";
    Wa.switch_modeInteractor("movePinch");
    console.log("INFO : Début de l'ajustement");
    vc("ADJUST_START");
  }

  //rétablit l'état normal du widget de réalité augmentée après avoir terminé le processus d'ajustement
  function Fb() {
    [Ca.adjustNotice, Ca.adjustExit].forEach(Pa);
    [Ca.adjust, Ca.changeModelContainer, Ca.buttonResizeCanvas].forEach(sa);
    Ca.cv.style.cursor = "auto";
    Sa.mode = Sa.realtime;
    Wa.switch_modeInteractor("idle");
    console.log("INFO : Fin de l'ajustement");
    vc("ADJUST_END");
  }

  function ic() {
    if (!Ca.trackIframe) {
      var S = Kb.appstaticURL + "jeewidget/"; //il faut changer
      Ca.trackIframe = document.createElement("iframe");
      Ca.trackIframe.width = "8";
      Ca.trackIframe.height = "8";
      Ca.trackIframe.src = S + "trackIframe.html";
      Ca.trackIframe.style.border = "none";
      wa(Ca.trackIframe, {
        position: "fixed",
        zIndex: -1,
        bottom: "0",
        right: "-10px",
      });
      window.addEventListener(
        "beforeunload",
        Zb.bind(null, "WINDOW_UNLOAD", null)
      );
      Ca.container.appendChild(Ca.trackIframe);
      console.log("INFO : iFrame de suivi ajoutée");
    }
  }

  function Zb(S, V) {
    if (Ca.trackIframe) {
      var ua = location.href.split("?").shift().split("://").pop();
      ua = ua.split("/").shift();
      ua = ua.split("www.").pop();
      S = { action: S, domain: ua };
      V && (S.sku = V);
      try {
        Ca.trackIframe.contentWindow.postMessage(S, "*");
        console.log(
          "INFO : Message posté à l'iFrame de suivi avec action : " + S.action
        );
      } catch (Ga) {
        console.error(
          "ERROR : Échec de l'envoi du message à l'iFrame de suivi."
        );
      }
    }
  }
  function Yc(S, V) {
    console.log("INFO : Changement de mode à temps réel.");
    Sa.mode = ob.realtime;
    if (V) {
      console.log("INFO : Exécution de la fonction de rappel fournie.");
      V();
    }
    console.log("INFO : Désactivation du chargement.");
    wb.toggle_loading(!1);
    console.log("INFO : Envoi d'une demande de comptage d'essai de session.");
    Zb("COUNT_TRY_ON_SESSION", S);
  }

  function Zc(S) {
    if (S.isAutoVTO) {
      console.log("INFO : Mode VTO automatique activé.");
      return Kb.autoVTOURL + "getByProductPage/" + encodeURIComponent(S.mod);
    }
    console.log("INFO : Mode VTO automatique désactivé.");
    var V = S.mod + ".json";
    return S.isStandalone
      ? (console.log("INFO : Utilisation du modèle en mode autonome."),
        kc + "models3DStandalone/" + V)
      : (console.log("INFO : Utilisation du modèle en mode non autonome."));
  }

  function $c(S, V, ua, Ga) {
    console.log(
      "INFO : Tentative de chargement du modèle avec les paramètres suivants :",
      S,
      V,
      ua,
      Ga
    );
    var Ka = Zc(V);
    console.log("INFO : URL du modèle déterminée :", Ka);
    if (V.isAutoVTO) {
      console.log(
        "INFO : Mode VTO automatique activé. Appel de la fonction Ja pour récupérer le modèle."
      );
      Ja(Ka, S)
        .then(function (response) {
          console.log("INFO : Modèle chargé avec succès.");
          ua(response);
        })
        .catch(function (error) {
          console.log("ERREUR : Échec du chargement du modèle :", error);
        });
    } else if (V.isStandalone) {
      console.log(
        "INFO : Mode VTO automatique désactivé. Mode autonome activé. Appel de la fonction Ua pour récupérer le modèle."
      );
      Ua(Ka, S)
        .then(function (response) {
          console.log("INFO : Modèle chargé avec succès.");
          ua(response);
        })
        .catch(function (error) {
          console.log("ERREUR : Échec du chargement du modèle :", error);
        });
    } else {
      console.log(
        "INFO : Mode VTO automatique désactivé. Mode autonome désactivé. Appel de la fonction load_model de l'objet Wa pour charger le modèle."
      );
      Wa.load_model(
        Ka,
        V.mats,
        function () {
          console.log("INFO : Modèle chargé avec succès.");
          Yc(S, ua);
        },
        S,
        Ga
      );
    }
  }

  // effectuer des opérations sur ce modèle une fois qu'il est chargé.
  function Xc(S, V, ua) {
    console.log(
      "INFO : Appel de la fonction Wa.set_modelStandalone pour définir le modèle autonome avec les paramètres suivants :",
      V,
      S
    );
    Wa.set_modelStandalone(
      V,
      function () {
        console.log("INFO : Modèle autonome défini avec succès.");
        Yc(S, ua);
      },
      S
    );
  }

  function vc(S) {
    console.log("INFO : Appel de la fonction vc avec l'argument : S");
    (S = ad[S]) && S();
  }

  function Ic() {
    console.log("INFO: La fonction Ic a été appelée.");
    Tb && Tb.detach();
    Tb = null;
    Tb = new wd(Ca.container, function (S) {
      console.log("INFO: La fonction Ic a attaché un événement.");
      Sb(!1);
    });
  }

  function Wc(S, V) {
    console.log("INFO: La fonction Wc a été appelée.");
    V = V || { scale: 1 };
    S
      ? (console.log("INFO: Tweaker défini avec les paramètres :", {
          preScale: S.scale * V.scale,
          preOffset: [0, S.dy, S.dz],
          rx: S.rx,
          beginBendZ: S.templesBendingOffset,
          bendStrength: S.templesBendingStrength,
          maskBranchStartEnd: S.templesFading,
        }),
        xd(S),
        yd(S.materials, S.templesTextureCopyMode || 0))
      : (console.log("INFO: Tweaker défini avec l'échelle :", {
          preScale: V.scale,
        }),
        bd());
  }

  //calculer les valeurs d'opacité (alpha)
  function zd(S, V) {
    console.log(
      "INFO: La fonction zd a été appelée avec les arguments S =",
      S,
      "et V =",
      V
    );
    if (!S.materials) {
      console.log("INFO: Pas de matériaux définis, renvoyant [0, 0, 0, 0].");
      return [0, 0, 0, 0];
    }
    if (!S.lensesYGradientEnabled || "lenses" !== V.id) {
      console.log(
        "INFO: Gradient Y des lentilles non activé ou ID différent de 'lenses', renvoyant [V.alpha, V.alpha, 0, 0]."
      );
      return [V.alpha, V.alpha, 0, 0];
    }
    var ua = -30 * S.lensesYGradientHeight - 40,
      Ga = 50 * S.lensesYGradientSmoothness;
    var result = [
      V.alpha * S.lensesYGradientAlphaMinFactor,
      V.alpha,
      ua - 0.5 * Ga,
      ua + 0.5 * Ga,
    ];
    console.log("INFO: Renvoie le résultat :", result);
    return result;
  }

  //mettre à jour les propriétés des matériaux d'un modèle en fonction des paramètres spécifiés dans l'objet S
  function xd(S) {
    console.log("INFO: La fonction xd a été appelée avec l'argument S ");
    if (S && S.materials && S.materials.length !== 0) {
      console.log(
        "INFO: Il y a des matériaux définis dans S, traitement en cours..."
      );
      S.materials.forEach(function (V) {
        console.log("INFO: Traitement du matériau", V);
        var ua = zd(S, V);
        console.log("INFO: Résultat de la fonction zd pour ce matériau :");
        V.matInds.forEach(function (Ga) {
          console.log("INFO: Mise à jour du matériau avec l'indice");
          Lb.update_material(
            Ga,
            {
              metalness: V.metalness,
              roughness: V.roughness,
              fresnelMin: V.fresnelRange[0],
              fresnelMax: V.fresnelRange[1],
              diffuseColor: V.color,
              isDisableColorTexture: V.isDisableColorTexture,
              alpha: ua,
              alphaUsage: 1,
            },
            !1
          );
        });
      });
    } else {
      console.log(
        "INFO: Aucun matériau défini dans S, appel de la fonction bd."
      );
      bd();
    }
  }

  function Ad(S) {
    console.log("INFO: La fonction Ad a été appelée avec l'argument S =");
    var matInds = [];
    var templesMaterial = S.find(function (V) {
      return "temples" === V.id;
    });
    if (templesMaterial) {
      matInds = templesMaterial.matInds;
      console.log(
        "INFO: Matériau des temples trouvé. Indices des matériaux :",
        matInds
      );
    } else {
      console.log("INFO: Aucun matériau de temples trouvé.");
    }
    return matInds;
  }

  function yd(S, V) {
    console.log(
      "INFO: La fonction yd a été appelée avec les arguments S =",
      S,
      "et V =",
      V
    );
    if (V) {
      console.log("INFO: V est évalué à true.");
      var ua = Ad(S);
      console.log("INFO: Indices des matériaux des temples :");
      if (2 === ua.length) {
        console.log(
          "INFO: Longueur des indices des matériaux des temples est égale à 2."
        );
        if (2 === V) {
          console.log("INFO: La valeur de V est 2.");
          ua.reverse();
          console.log("INFO: Indices inversés :", ua);
        }
        Lb.get_materialsSpec().then(function (Ga) {
          console.log("INFO: Spécifications des matériaux récupérées :");
          Lb.update_material(
            ua[0],
            { diffuseTexture: Ga[ua[1]].diffuseTexture },
            !0
          );
          console.log("INFO: Matériau mis à jour :");
        });
      } else {
        console.log(
          "INFO: La longueur des indices des matériaux des temples n'est pas égale à 2."
        );
      }
    } else {
      console.log(
        "INFO: V est évalué à false ou undefined. La fonction yd ne sera pas exécutée."
      );
    }
  }

  function bd() {
    console.log("INFO: La fonction bd a été appelée.");
    Lb.get_materialsSpec().then(function (S) {
      console.log("INFO: Spécifications des matériaux récupérées :");
      var V = S.length;
      console.log("INFO: Nombre total de matériaux :", V);
      for (var i = 0; i < V; ++i) {
        console.log("INFO: Mise à jour du matériau", i);
        Lb.update_material(i, { alphaUsage: 1 });
      }
      console.log(
        "INFO: Tous les matériaux ont été mis à jour avec alphaUsage: 1."
      );
    });
  }

  function Bd(S) {
    console.log("INFO: La fonction Bd a été appelée avec le paramètre :");
    return S
      ? "json" === S.split(".").pop().toLowerCase()
        ? (console.log("INFO: L'extension du fichier est JSON."),
          Promise.resolve(S))
        : va(Kb.glassesDBURL + S).then(function (V) {
            console.log("INFO: Récupération des données du fichier :", V);
            return V.intrinsic
              ? (console.log(
                  "INFO: Le fichier contient des données intrinsèques."
                ),
                Zc(V.intrinsic))
              : (console.log(
                  "INFO: Le fichier ne contient pas de données intrinsèques."
                ),
                "");
          })
      : (console.log("INFO: Pas de fichier spécifié."), Promise.resolve(""));
  }

  //interpolation linéaire
  var Lb = (function () {
      function S(a, b) {
        console.log(
          "INFO: La fonction S a été appelée avec les paramètres :",
          a,
          b
        );
        return a[0] * (1 - b) + a[1] * b;
      }

      function V(a, b) {
        console.log("INFO: Appel de la fonction V avec l'URL :", a);
        var d = new XMLHttpRequest();
        d.open("GET", a, !0);
        d.withCredentials = !1;
        d.onreadystatechange = function () {
          if (4 !== d.readyState) return;
          if (200 !== d.status && 0 !== d.status) {
            console.log(
              "ERREUR: La requête a échoué avec le code de statut :",
              d.status
            );
            return;
          }
          console.log("INFO: Réponse reçue avec succès.");
          b(d.responseText);
        };
        d.send();
      }

      function ua(a, b) {
        console.log("INFO: Appel de la fonction ua avec l'URL :", a);
        V(a + "", function (d) {
          console.log("INFO: Réponse JSON reçue avec succès.");
          b(JSON.parse(d));
        });
      }

      function Ga(a, b) {
        console.log("INFO: Appel de la fonction Ga avec les arguments:", a, b);
        if (0 === b || "object" !== typeof a) return a;
        console.log("INFO: Clonage de l'objet en cours...");
        a = Object.assign({}, a);
        b = void 0 === b || -1 === b ? -1 : b - 1;
        console.log("INFO: Profondeur restante:", b);
        for (var d in a) a[d] = Ga(a[d], b);
        console.log("INFO: Clonage terminé.");
        return a;
      }

      //interpoler des valeurs entre 0 et 1
      //une fonction de lissage cubique
      function Ka(a) {
        console.log("INFO: Appel de la fonction Ka avec l'argument:", a);
        var result;
        if (0.5 > a) {
          result = 4 * a * a * a;
        } else {
          result = (a - 1) * (2 * a - 2) * (2 * a - 2) + 1;
        }
        console.log("INFO: Résultat de la fonction Ka:", result);
        return result;
      }

      //fonction qui génère des instructions GLSL (OpenGL Shading Language) en fonction du type de fonction d'activation spécifiée.
      function vb(a) {
        console.log("INFO: Appel de la fonction vb avec l'argument:", a);
        switch (a) {
          case "relu":
            console.log("INFO: Activation relu sélectionnée.");
            return "gl_FragColor=max(vec4(0.),gl_FragColor);";
          case "elu":
            console.log("INFO: Activation elu sélectionnée.");
            return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.),gl_FragColor,step(0.,gl_FragColor));";
          case "elu01":
            console.log("INFO: Activation elu01 sélectionnée.");
            return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1),gl_FragColor,step(0.,gl_FragColor));";
          case "arctan":
            console.log("INFO: Activation arctan sélectionnée.");
            return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";
          case "copy":
            console.log("INFO: Activation copy sélectionnée.");
            return "";
          case "gelu":
            console.log("INFO: Activation gelu sélectionnée.");
            return "gl_FragColor=gl_FragColor;\n vec4 zou=gl_FragColor;\n  vec4 polyZou=0.7978845608028654*(zou+0.044715*zou*zou*zou);\nvec4 exZou=exp(-abs(polyZou));\n          vec4 exZou2=exZou*exZou;\n          vec4 tanhZou=sign(polyZou)*(vec4(1.)-exZou2)/(vec4(1.)+exZou2);\n          gl_FragColor=0.5*zou*(vec4(1.)+tanhZou);";
          default:
            console.log("ERROR: Activation inconnue.");
            return !1;
        }
      }

      function La(a, b) {
        console.log(
          "INFO: Appel de la fonction La avec les arguments:",
          a,
          "et",
          b
        );
        var d = b % 8;
        var result = (a[(b - d) / 8] >> (7 - d)) & 1;
        console.log("INFO: La valeur retournée est:", result);
        return result;
      }

      function kb(a, b, d) {
        console.log(
          "INFO: Appel de la fonction kb avec les arguments:",
          a,
          b,
          d
        );
        var f = 1,
          l = 0;
        for (d = b + d - 1; d >= b; --d) {
          console.log("INFO: Calcul pour l'index", d);
          l += f * La(a, d);
          f *= 2;
        }
        console.log("INFO: La valeur retournée est:", l);
        return l;
      }

      function zb(a) {
        console.log("INFO: Appel de la fonction zb avec l'argument:", a);
        a = a.data;
        console.log("INFO: Données reçues:", a);
        a =
          "undefined" === typeof btoa
            ? Buffer.from(a, "base64").toString("latin1")
            : atob(a);
        console.log("INFO: Données décodées:", a);
        for (var b = a.length, d = new Uint8Array(b), f = 0; f < b; ++f) {
          console.log("INFO: Conversion de la valeur à l'index", f);
          d[f] = a.charCodeAt(f);
        }
        console.log("INFO: Tableau Uint8Array final:", d);
        return d;
      }

      function Gb(a) {
        console.log("INFO: Appel de la fonction Gb avec l'argument:", a);
        var result = "string" === typeof a ? JSON.parse(a) : a;
        console.log("INFO: Résultat de la fonction Gb:", result);
        return result;
      }

      function Pb(a) {
        console.log("INFO: Appel de la fonction Pb avec l'argument:", a);
        var parsed = Gb(a);
        var result = "undefined" === typeof parsed.nb ? Mb(a) : ac(a);
        console.log("INFO: Résultat de la fonction Pb:", result);
        return result;
      }

      function ac(a) {
        console.log("INFO: Appel de la fonction ac avec l'argument:", a);
        var parsed = Gb(a);
        var nb = parsed.nb;
        if (0 === nb) {
          console.log("INFO: Renvoie un tableau Uint8Array vide.");
          return new Uint8Array(nb);
        }
        var n = parsed.n;
        var buffer = zb(parsed);
        var result = new Uint32Array(n);
        for (var i = 0; i < n; ++i) {
          result[i] = kb(buffer, i * nb, nb);
        }
        console.log("INFO: Résultat de la fonction ac:", result);
        return result;
      }

      function Mb(a) {
        console.log("INFO: Appel de la fonction Mb avec l'argument:", a);
        var parsed = Gb(a);
        var ne = parsed.ne;
        var nf = parsed.nf;
        var n = parsed.n;
        var buffer = zb(parsed);
        var floatArray = new Float32Array(nf);
        var floatArray2 = new Float32Array(ne);
        var w = ne + nf + 1;
        for (var h = 0; h < n; ++h) {
          var m = w * h;
          var q = 0 === La(buffer, m) ? 1 : -1;
          var x = kb(buffer, m + 1, ne);
          m = m + 1 + ne;
          var p = new Array(nf);
          for (var I = p.length, u = 0, y = m; y < m + I; ++y) {
            p[u] = La(buffer, y);
            ++u;
          }
          for (var sum = 0, I = (m = 0); I < nf; ++I) {
            sum += p[I] * Math.pow(2, -I - 1);
          }
          floatArray[h] =
            0 === sum && 0 === x
              ? 0
              : q * (1 + sum) * Math.pow(2, 1 + x - Math.pow(2, ne - 1));
        }
        console.log("INFO: Résultat de la fonction Mb:", floatArray);
        return floatArray;
      }

      function lc(a) {
        console.log("INFO: Appel de la fonction lc avec l'argument:", a);
        var b = null,
          d = null,
          f = null,
          l = 0,
          p = this,
          w = null,
          h = { Nc: [], Zd: "none", eg: !1, Yd: null, grid: null };
        this.m = function () {
          console.log("INFO: Exécution de la méthode m");
          this.Wk(w.Nc);
          f.Do({ Zd: w.Zd, eg: w.eg, Yd: w.Yd });
        };
        this.cm = function (m) {
          console.log("INFO: Appel de la méthode cm avec l'argument:", m);
          return b[m];
        };
        this.te = function (m) {
          console.log("INFO: Appel de la méthode te avec l'argument:", m);
          ["s32", "s34", "s27"].forEach(function (q) {
            aa.j(q, [{ type: "2f", name: "u20", value: m }]);
          });
          b &&
            b.forEach(function (q) {
              q.te(m);
            });
        };
        this.Wk = function (m) {
          console.log("INFO: Appel de la méthode Wk avec l'argument:", m);
          var q = null;
          l = m.length;
          var x =
              null !== w.grid &&
              a.grid.length &&
              !(1 === a.grid[0] && 1 === a.grid[1]),
            I = x ? w.grid : [1, 1];
          x && this.te(I);
          b = m.map(function (u, y) {
            u = Object.assign({}, u, {
              index: y,
              parent: p,
              de: q,
              Mm: y === l - 1,
              Ic: x,
              za: I,
            });
            return (q = 0 === y ? Cd.instance(u) : Dd.instance(u));
          });
          d = b[0];
          f = b[l - 1];
          b.forEach(function (u, y) {
            0 !== y && u.Bn();
          });
        };
        this.Aa = function (m) {
          console.log("INFO: Appel de la méthode Aa avec l'argument:", m);
          m.h(0);
          var q = m;
          b.forEach(function (x) {
            q = x.Aa(q, !1);
          });
          return q;
        };
        this.ai = function () {
          console.log("INFO: Appel de la méthode ai");
          return d.bm();
        };
        this.Fc = function () {
          console.log("INFO: Appel de la méthode Fc");
          return f.fm();
        };
        this.Xh = function () {
          console.log("INFO: Appel de la méthode Xh");
          return f.Xh();
        };
        this.A = function () {
          console.log("INFO: Appel de la méthode A");
          b &&
            (b.forEach(function (m) {
              m.A();
            }),
            (f = d = b = null),
            (l = 0));
        };
        "undefined" !== typeof a && ((w = Object.assign({}, h, a)), this.m());
      }

      function Nb(a, b) {
        console.log("INFO: Appel de la fonction Nb avec les arguments:", a, b);
        a[b] = !0;
        console.log(
          "INFO: L'attribut",
          b,
          "de l'élément",
          a,
          "a été défini sur true"
        );
        a.setAttribute(b, "true");
        console.log(
          "INFO: L'attribut",
          b,
          "de l'élément",
          a,
          "a été ajouté à l'élément avec la valeur 'true'"
        );
      }

      // vérifie si l'utilisateur navigue sur un appareil mobile en analysant l'User Agent du navigateur.
      function mc() {
        console.log("INFO: Appel de la fonction mc");
        var a = !1,
          b = navigator.userAgent || navigator.vendor || window.opera;
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            b
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            b.substr(0, 4)
          )
        )
          a = !0;
        console.log("INFO: La fonction mc a retourné:", a);
        return a;
      }

      function wc(a, b) {
        console.log("INFO: Appel de la fonction wc");
        window.addEventListener(
          "beforeunload",
          function () {
            console.log("INFO: Événement beforeunload détecté");
            b &&
              b.getTracks &&
              b.getTracks().forEach(function (d) {
                console.log("INFO: Suppression de la piste vidéo");
                b.removeTrack(d);
              });
            a.videoStream && a.videoStream.stop();
            a.videoStream = null;
            console.log(
              "INFO: Arrêt du flux vidéo et suppression de la référence"
            );
          },
          !1
        );
      }

      //vérifie si le navigateur actuel est Safari en ne vérifiant pas s'il s'agit de Chrome.
      function xc() {
        console.log("INFO: Appel de la fonction xc");
        var a = navigator.userAgent.toLowerCase();
        var isSafari = -1 !== a.indexOf("safari") && -1 === a.indexOf("chrome");
        console.log("INFO: Résultat de la détection Safari:", isSafari);
        return isSafari;
      }
      function yc(a) {
        console.log("INFO: Appel de la fonction yc avec l'argument:", a);
        if (!a) {
          console.log("INFO: L'argument est vide, retourne null");
          return a;
        }
        var b = null;
        if (a.video) {
          var d = function (f) {
            return f && "object" === typeof f ? Object.assign({}, f) : f;
          };
          b = {};
          "undefined" !== typeof a.video.width && (b.width = d(a.video.width));
          "undefined" !== typeof a.video.height &&
            (b.height = d(a.video.height));
          "undefined" !== typeof a.video.facingMode &&
            (b.facingMode = d(a.video.facingMode));
        }
        b = { audio: a.audio, video: b };
        "undefined" !== typeof a.deviceId && nc(b, a.deviceId);
        console.log("INFO: Résultat de la fonction yc:", b);
        return b;
      }

      function nc(a, b) {
        console.log("INFO: Appel de la fonction nc avec les arguments:", a, b);
        b &&
          ((a.video = a.video || {}),
          (a.video.deviceId = { exact: b }),
          a.video.facingMode && delete a.video.facingMode);
        console.log("INFO: Résultat après l'appel de la fonction nc:", a);
      }

      function bc(a) {
        console.log("INFO: Appel de la fonction bc avec l'argument:", a);
        var b = a.video.width;
        a.video.width = a.video.height;
        a.video.height = b;
        console.log("INFO: Résultat après l'appel de la fonction bc:", a);
        return a;
      }

      function zc(a) {
        console.log("INFO: Appel de la fonction zc avec l'argument:", a);

        function b(u) {
          console.log("INFO: Appel de la fonction b avec l'argument:", u);
          return [
            480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366,
            1920,
          ].sort(function (y, A) {
            return Math.abs(y - u) - Math.abs(A - u);
          });
        }

        function d(u) {
          console.log("INFO: Appel de la fonction d avec l'argument:", u);
          var y = yc(a);
          u = u(y);
          l.push(u);
          f(u);
        }

        function f(u) {
          console.log("INFO: Appel de la fonction f avec l'argument:", u);
          if (u.video && u.video.facingMode && u.video.facingMode.exact) {
            var y = u.video.facingMode.exact;
            u = yc(u);
            delete u.video.facingMode.exact;
            u.video.facingMode.ideal = y;
            l.push(u);
          }
        }

        var l = [];

        if (!a || !a.video) return l;

        f(a);

        if (a.video.width && a.video.height) {
          if (a.video.width.ideal && a.video.height.ideal) {
            var p = b(a.video.width.ideal).slice(0, 3),
              w = b(a.video.height.ideal).slice(0, 3),
              h = {},
              m = 0;

            for (h.Ib = void 0; m < p.length; h = { Ib: h.Ib }, ++m) {
              h.Ib = p[m];
              var q = {},
                x = 0;

              for (q.xb = void 0; x < w.length; q = { xb: q.xb }, ++x) {
                if (
                  ((q.xb = w[x]),
                  h.Ib !== a.video.width.ideal || q.xb !== a.video.height.ideal)
                ) {
                  var I = Math.max(h.Ib, q.xb) / Math.min(h.Ib, q.xb);
                  I < 4 / 3 - 0.1 ||
                    I > 16 / 9 + 0.1 ||
                    d(
                      (function (u, y) {
                        return function (A) {
                          A.video.width.ideal = u.Ib;
                          A.video.height.ideal = y.xb;
                          return A;
                        };
                      })(h, q)
                    );
                }
              }
            }
          }
          d(function (u) {
            return bc(u);
          });
        }

        a.video.width &&
          a.video.height &&
          (a.video.width.ideal &&
            a.video.height.ideal &&
            d(function (u) {
              delete u.video.width.ideal;
              delete u.video.height.ideal;
              return u;
            }),
          d(function (u) {
            delete u.video.width;
            delete u.video.height;
            return u;
          }));

        a.video.facingMode &&
          (d(function (u) {
            delete u.video.facingMode;
            return u;
          }),
          a.video.width &&
            a.video.height &&
            d(function (u) {
              bc(u);
              delete u.video.facingMode;
              return u;
            }));

        l.push({ audio: a.audio, video: !0 });

        return l;
      }

      function oc(a) {
        console.log("INFO: Appel de la fonction oc avec l'argument:", a);
        a.volume = 0;
        console.log("INFO: Volume réglé sur 0");

        Nb(a, "muted");
        console.log("INFO: Élément audio muté");

        if (xc()) {
          console.log("INFO: Safari détecté");

          if (1 === a.volume) {
            console.log("INFO: Volume initial détecté à 1");
            var b = function () {
              a.volume = 0;
              console.log(
                "INFO: Volume réglé sur 0 après détection de la souris ou du toucher"
              );
              window.removeEventListener("mousemove", b, !1);
              window.removeEventListener("touchstart", b, !1);
              console.log(
                "INFO: Événements de la souris et du toucher retirés"
              );
            };
            window.addEventListener("mousemove", b, !1);
            window.addEventListener("touchstart", b, !1);
            console.log(
              "INFO: Événements de la souris et du toucher ajoutés pour régler le volume à 0"
            );
          }
          setTimeout(function () {
            a.volume = 0;
            console.log(
              "INFO: Volume réglé sur 0 après délai de 5 millisecondes"
            );
            Nb(a, "muted");
            console.log(
              "INFO: Élément audio muté après délai de 5 millisecondes"
            );
          }, 5);
        }
      }

      function Ed(a) {
        console.log("INFO: Appel de la fonction Ed avec l'argument:", a);
        var b = Fa.element,
          d = Fa.wh;
        if (null === b) {
          console.log(
            "INFO: Aucun élément vidéo trouvé, résolution immédiate de la promesse."
          );
          return Promise.resolve();
        } else {
          console.log("INFO: Élément vidéo trouvé.");
          return new Promise(function (f, l) {
            if (b.srcObject && b.srcObject.getVideoTracks) {
              console.log(
                "INFO: Objet source vidéo et méthode getVideoTracks disponibles."
              );
              var p = b.srcObject.getVideoTracks();
              if (p.length !== 1) {
                console.log(
                  "ERROR: Nombre de pistes vidéo invalide:",
                  p.length
                );
                l("INVALID_TRACKNUMBER");
              } else {
                console.log("INFO: Une seule piste vidéo trouvée.");
                p = p[0];
                if (a) {
                  console.log("INFO: Arrêt de la piste vidéo.");
                  cd(b, f, l, d);
                } else {
                  console.log(
                    "INFO: Arrêt de la piste vidéo sans arrêt de la lecture."
                  );
                  p.stop();
                  f();
                }
              }
            } else {
              console.log(
                "ERROR: Implémentation de l'objet source vidéo ou de la méthode getVideoTracks non valide."
              );
              l("BAD_IMPLEMENTATION");
            }
          });
        }
      }

      function dd(a, b, d, f) {
        console.log(
          "INFO: Appel de la fonction dd avec les arguments:",
          a,
          b,
          d,
          f
        );
        function l(w) {
          p || ((p = !0), d(w));
        }
        var p = !1;
        console.log(
          "INFO: Demande d'autorisation pour accéder à la caméra et au microphone."
        );
        navigator.mediaDevices
          .getUserMedia(f)
          .then(function (w) {
            console.log("INFO: Autorisation accordée.");
            function h() {
              setTimeout(function () {
                if (a.currentTime) {
                  var q = a.videoHeight;
                  if (0 === a.videoWidth || 0 === q) l("VIDEO_NULLSIZE");
                  else {
                    q = {
                      dl: null,
                      Fg: null,
                      jn: null,
                    };
                    try {
                      var x = w.getVideoTracks()[0];
                      x &&
                        ((q.jn = x),
                        (q.dl = x.getCapabilities()),
                        (q.Fg = x.getSettings()));
                    } catch (I) {}
                    p || (wc(a, w), b(a, w, q));
                  }
                } else l("VIDEO_NOTSTARTED");
              }, 700);
            }

            function m() {
              a.removeEventListener("loadeddata", m, !1);
              var q = a.play();
              oc(a);
              "undefined" === typeof q
                ? h()
                : q
                    .then(function () {
                      h();
                    })
                    .catch(function () {
                      l("VIDEO_PLAYPROMISEREJECTED");
                    });
            }
            "undefined" !== typeof a.srcObject
              ? (a.srcObject = w)
              : ((a.src = window.URL.createObjectURL(w)), (a.videoStream = w));
            oc(a);
            a.addEventListener("loadeddata", m, !1);
          })
          .catch(function (w) {
            console.log("ERROR: Échec de l'autorisation:", w);
            l(w);
          });
      }

      function cd(a, b, d, f) {
        console.log(
          "INFO: Appel de la fonction cd avec les arguments:",
          a,
          b,
          d,
          f
        );
        a
          ? navigator.mediaDevices && navigator.mediaDevices.getUserMedia
            ? (Nb(a, "autoplay"),
              Nb(a, "playsinline"),
              f && f.audio ? (a.volume = 0) : Nb(a, "muted"),
              Fd(f).then(function () {
                dd(
                  a,
                  b,
                  function () {
                    function l(w) {
                      if (0 === w.length)
                        d("NO_VALID_MEDIASTREAM_FALLBACK_CONSTRAINTS");
                      else {
                        var h = w.shift();
                        console.log(
                          "INFO: Tentative de création d'un flux média avec les contraintes:",
                          h
                        );
                        dd(
                          a,
                          b,
                          function () {
                            l(w);
                          },
                          h
                        );
                      }
                    }
                    var p = zc(f);
                    console.log(
                      "INFO: Tentative de création d'un flux média avec les contraintes:",
                      p
                    );
                    l(p);
                  },
                  f
                );
              }))
            : d && d("MEDIASTREAMAPI_NOT_FOUND")
          : d && d("VIDEO_NOT_PROVIDED");
      }

      function Fd(a) {
        console.log("INFO: Appel de la fonction Fd avec l'argument:", a);
        if (!a || !a.video || !a.video.facingMode)
          return Promise.resolve("NO_VIDEO_CONSTRAINTS");
        if (a.video.deviceId) return Promise.resolve("DEVICEID_ALREADY_SET");
        var b = a.video.facingMode;
        b = b.exact || b.ideal;
        if (!b) return Promise.resolve("NO_FACINGMODE");
        var d = { user: [], environment: ["camera2 0"] }[b];
        return d && 0 !== d.length
          ? new Promise(function (f) {
              ed(function (l) {
                l
                  ? ((l = l.find(function (p) {
                      var w = p.label;
                      return w
                        ? d.some(function (h) {
                            return w.includes(h);
                          })
                        : !1;
                    })),
                    l
                      ? ((a.video.deviceId = { exact: l.deviceId }),
                        f("SUCCESS"))
                      : f("NO_PREFERRED_DEVICE_FOUND"))
                  : f("NO_DEVICES_FOUND");
              });
            })
          : Promise.resolve("NO_PREFERRED_CAMERAS");
      }

      function ed(a) {
        console.log("INFO: Appel de la fonction ed");
        navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
          ? navigator.mediaDevices
              .enumerateDevices()
              .then(function (b) {
                b = b.filter(function (d) {
                  return (
                    d.kind &&
                    -1 !== d.kind.toLowerCase().indexOf("video") &&
                    d.label &&
                    d.deviceId
                  );
                });
                b && b.length && 0 < b.length
                  ? a(b, !1)
                  : a(!1, "NODEVICESFOUND");
              })
              .catch(function () {
                a(!1, "PROMISEREJECTED");
              })
          : a(!1, "NOTSUPPORTED");
      }

      function Gd() {
        function a(K) {
          console.log("INFO: Appel de la fonction a");
          K = K ? Ac.ff : 1;
          ia.width = K * J.width;
          ia.height = K * J.height;
          return ia;
        }

        function b(K) {
          console.log("INFO: Appel de la fonction b");
          var R = K.length - 1,
            Z = K[R];
          if ("data:" === Z.substring(0, 5)) return Z;
          for (Z = ""; 0 <= R; --R) {
            var pa = K[R],
              Oa = "http" === pa.substring(0, 4).toLowerCase();
            Z = pa + Z;
            if (Oa) break;
          }
          return Z;
        }
        function d(K, R, Z) {
          console.log("INFO: Appel de la fonction d");
          return new Promise(function (pa) {
            Ba.Jj(R);
            Ea.ba();
            lb.isEnabled = !0;
            Xa.isEnabled = !1;
            lb.pa || (lb.pa = pc.instance({}));
            K.ci() && (lb.pa.wg(K.ci()), Ba.ra(lb.pa));
            K.set();
            Xa.isEnabled = !1;
            u();
            var Oa = mb.Zh(Z);
            setTimeout(function () {
              lb.isEnabled = !1;
              Ba.Jj(!1);
              pa(Oa);
            }, 1);
          });
        }

        function f(K, R) {
          console.log("INFO: Appel de la fonction f");
          Da.Xc = 0.5;
          return new Promise(function (Z) {
            Xa.bc = K;
            Xa.isEnabled = !0;
            Xa.D = function () {
              var pa = fd.instance(R());
              Xa.D = null;
              Z(pa);
            };
          });
        }

        function l(K, R) {
          console.log("INFO: Appel de la fonction l");
          return new Promise(function (Z, pa) {
            ua(R + K, function (Oa) {
              if (Oa.error) {
                pa("SKU_NOT_FOUND");
              } else {
                Z({ kn: Oa.intrinsic.mod + ".json", hn: Oa.intrinsic.mats });
              }
            });
          });
        }

        function p(K, R) {
          console.log("INFO: Appel de la fonction p");
          var Z = b([J.ea, J.wa, J.Vd + "/"]);
          R = R.map(function (pa) {
            return Z + pa;
          });
          W.model = {
            url: b([J.ea, J.wa, J.Wd + "/" + K]),
            ac: R,
            jh: !1,
            ih: !1,
          };
          return new Promise(function (pa) {
            Ra.Hi(W.model, function () {
              da.isBusy = !1;
              pa();
            });
          });
        }

        function w(K, R) {
          console.log("INFO: Appel de la fonction w");
          if (!R) return K;
          K = K.slice(0);
          var Z = ab.sf().map(function (ib) {
            return ib.toLowerCase();
          });
          for (var pa in R) {
            var Oa = R[pa];
            var pb = "number" === typeof pa ? pa : Z.indexOf(pa.toLowerCase());
            if (-1 !== pb) {
              K[pb] = Oa;
            }
          }
          return K;
        }

        function h(K, R) {
          console.log("INFO: Appel de la fonction h");
          return new Promise(function (Z, pa) {
            da.set_model(
              K,
              function () {
                da.set_materials(R, function () {
                  da.isBusy = !1;
                  Z();
                });
              },
              function () {
                da.isBusy = !1;
                pa("CANNOT_LOAD_MODEL");
              }
            );
          });
        }

        function m(K, R) {
          console.log("INFO: Appel de la fonction m");
          K &&
            (R && A(),
            K.preOffset && (tb = K.preOffset),
            K.preScale && (Ub = K.preScale),
            void 0 !== K.rx && (t = K.rx),
            void 0 !== K.beginBendZ && (v = K.beginBendZ),
            void 0 !== K.bendStrength && (Vb = K.bendStrength),
            K.maskBranchStartEnd && (Wb = K.maskBranchStartEnd),
            da.ready && Ra.we());
        }

        function q(K) {
          console.log("INFO: Appel de la fonction q");
          K.tweaker ? m(K.tweaker, !0) : (A(), da.ready && Ra.we());
        }

        function x() {
          da.load_model = function (K, R, Z, pa, Oa, pb) {
            console.log("INFO: Appel de la fonction da.load_model");
            if (da.isBusy) return !1;
            da.isBusy = !0;
            R = w(R, Oa);
            (W.model ? h(K, R) : p(K, R)).then(Z).catch(pb);
            return !0;
          };

          da.set_offset = function (K) {
            console.log("INFO: Appel de la fonction da.set_offset");
            ma = K;
            Ra.ue();
          };

          da.set_scale = function (K) {
            console.log("INFO: Appel de la fonction da.set_scale");
            ya = K;
            Ra.ve();
          };

          da.set_rx = function (K) {
            console.log("INFO: Appel de la fonction da.set_rx");
            qa = K;
            Ra.Yj();
          };

          da.switch_shadow = Ba.Kg;
          da.switch_bgBlur = Ba.Jg;
          da.set_zoom = Ba.vg;
          da.is_viewer3D = function () {
            var is3D = xa === ra.Ka;
            console.log("Le visualiseur est en mode 3D :", is3D);
            return is3D;
          };

          da.switch_viewer3D = function (K, R) {
            console.log("Début de la fonction switch_viewer3D");
            if (
              xa === ra.mc ||
              xa === ra.nc ||
              (xa === ra.Y && !K) ||
              (xa === ra.Ka && K) ||
              Xa.isEnabled
            )
              return !1;
            if (xa === ra.va)
              return ub !== ra.Ka || K
                ? ub === ra.Y && K
                  ? ((ub = ra.Ka),
                    Ba.ra(Da.Hb),
                    Ba.cb(1),
                    R && R(),
                    console.log("Mode 3D activé"),
                    !0)
                  : !1
                : ((ub = ra.Y),
                  Ba.ra(Da.Ja),
                  Ba.cb(0),
                  R && R(),
                  console.log("Mode 3D désactivé"),
                  !0);
            var Z = 0,
              pa = -1,
              Oa = 0;
            xa === ra.Y
              ? ((xa = ra.mc), (pa = J.lp))
              : xa === ra.Ka && ((xa = ra.nc), (pa = J.op));
            var pb = Jc.mf();
            Ab = setInterval(function () {
              var ib = Jc.mf();
              Z += (ib - pb) / pa;
              1 <= Z &&
                ((Z = 1),
                xa === ra.mc
                  ? ((xa = ra.Ka), Ba.ra(Da.Hb), console.log("Mode 3D activé"))
                  : ((xa = ra.Y),
                    Ba.ra(Da.Ja),
                    console.log("Mode 3D désactivé")),
                R && R(),
                clearInterval(Ab),
                (Ab = null));
              var Qb = xa === ra.nc || xa === ra.Y ? 1 - J.jp(Z) : J.ip(Z);
              Ba.cb(Qb);
              (xa !== ra.nc && xa !== ra.mc) ||
                0 !== Oa++ % 2 ||
                (Ba.ra(Da.Yf), Da.Yf.xo(Qb));
              pb = ib;
            }, 0.016);
            console.log("Fin de la fonction switch_viewer3D");
            return !0;
          };

          da.capture_image = function (K, R, Z, pa) {
            console.log("Début de la capture d'image");
            Xa.bc = K;
            Xa.isEnabled = !0;
            "undefined" === typeof isAllocate && (Z = !1);
            (pa = "undefined" === typeof pa ? !1 : pa) && Ba.me(!1);
            L();
            Xa.D = function () {
              console.log("Début du traitement après la capture d'image");
              Ba.ej(0);
              c.flush();
              var Oa = mb.Zh(Z);
              R(Oa);
              pa && Ba.me(!0);
              console.log("Fin du traitement après la capture d'image");
            };
            console.log("Fin de la capture d'image");
          };

          da.capture_detection = function (K, R) {
            console.log("Début de la capture de la détection");
            var Z = null === la.Kb ? la.kb : la.$c;
            f(K, function () {
              console.log("Construction des données de capture");
              return {
                nd: T.pc.clone(),
                Zf: ab.gi(),
                Uf: ab.ei(),
                background: Z.clone(),
                pa: za.La.hi().clone(),
                Tf: nb,
              };
            }).then(function (result) {
              console.log("Fin de la capture de la détection");
              R(result);
            });
          };

          da.process_image = function (K) {
            function R() {
              console.log("Début de la fonction R");
              return new Promise(function (Bb, rb) {
                Xa.Ug = ib.updateLightInterval;
                f(ib.nSteps, Z).then(function (jb) {
                  Xa.Ug = 3;
                  if (jb) {
                    if (1 >= jb.hm().data[0]) {
                      console.log("Aucun visage détecté");
                      jb.I();
                      rb("FACE_NOT_FOUND");
                    } else {
                      d(jb, ib.isMask, !0).then(function (Hd) {
                        console.log("Détection du visage réussie");
                        Ba.ra(Da.Ja);
                        jb.I();
                        Bb(Hd);
                      });
                    }
                  } else {
                    console.log("Erreur critique lors de la détection");
                    rb("CRITICAL");
                  }
                });
                u();
              });
            }

            function Z() {
              console.log("Début de la fonction Z");
              return {
                nd: T.pc.clone(),
                Zf: !1,
                Uf: !1,
                background: la.kb.clone(!0),
                pa: za.La.hi().clone(),
              };
            }
            function pa() {
              console.log("Début de la fonction pa");
              return new Promise(function (Bb, rb) {
                l(ib.modelSKU, ib.glassesDBURL)
                  .then(function (jb) {
                    console.log("Chargement du modèle :", jb.kn);
                    da.load_model(
                      jb.kn,
                      jb.hn,
                      function () {
                        console.log("Modèle chargé avec succès");
                        Bb();
                      },
                      ib.modelSKU,
                      null,
                      function () {
                        console.log("Erreur : impossible de charger le modèle");
                        rb("CANNOT_LOAD_MODEL");
                      }
                    );
                  })
                  .catch(function (jb) {
                    console.log(
                      "Erreur lors de la récupération des données du modèle :",
                      jb
                    );
                    rb(jb);
                  });
              });
            }

            function Oa() {
              console.log("Début de la fonction Oa");
              if (ib.image) {
                console.log("Image disponible :", ib.image);
                var Bb = ib.image;
                pb(Bb);
                return Promise.resolve(Bb);
              }
              return new Promise(function (rb) {
                console.log(
                  "Chargement de l'image en base64 :", ib.imageBase64 );
                var jb = new Image();
                jb.onload = function () {
                  console.log("Image chargée avec succès");
                  pb(jb);
                  rb();
                };
                jb.src = ib.imageBase64;
              });
            }
            function pb(Bb) {
              console.log("Début de la fonction pb");
              var rb = Bb.width,
                jb = Bb.height;
              console.log("Dimensions de l'image :", rb, "x", jb);
              if (rb !== J.width || jb !== J.height) {
                console.log("Redimensionnement de l'élément Fa.element");
                Fa.Md && ((Fa.element.width = rb), (Fa.element.height = jb)),
                  console.log("Redimensionnement des éléments graphiques");
                E(rb, jb, ib.overSamplingFactor);
              }
              console.log(
                "Dessin de l'image sur le contexte graphique de Fa.Lh"
              );
              Fa.Lh.drawImage(Bb, 0, 0);
              console.log("Mise à jour de l'affichage");
              L();
            }

            var ib = Object.assign(
              {
                  imageBase64: null,
                  image: null,
                  FOVHztDeg: 0,
                  nSteps: 50,
                  updateLightInterval: 3,
                  overSamplingFactor: 2,
                  modelSKU: "undef",
                  glassesDBURL: "/MyApp_AR/api/gl/",
                  isMask: !0,
              },
              K
          );
          console.log("Paramètres de configuration initialisés avec succès :", ib);
          
            console.log("Objet ib après l'assignation :", ib);
            console.log("J.Lc:", J.Lc);
            if (J.Lc) {
              console.error("This feature cannot be called: J.Lc is true");
              throw Error("This feature cannot be called");
            }

            console.log(
              "Value of cb.FOVforced before potentially changing:",
              cb.FOVforced 
            );
            var Qb = cb.FOVforced;
            if (ib.FOVHztDeg) {
              console.log("Changing cb.FOVforced to:", ib.FOVHztDeg);
              cb.FOVforced = ib.FOVHztDeg;
            }
            Ba.ra(Da.Ja);

            return new Promise(function (Bb, rb) {
              console.log("Starting promise chain...");
              return pa()
                .then(function () {
                  console.log("pa() resolved successfully");
                  return Oa();
                })
                .then(function () {
                  console.log("Oa() resolved successfully");
                  return R();
                })
                .then(function (jb) {
                  console.log("R() resolved successfully");
                  cb.FOVforced = Qb;
                  console.log("Restoring cb.FOVforced to:", Qb);
                  Bb(jb);
                })
                .catch(function (error) {
                  console.error("An error occurred:", error);
                  rb(error);
                });
            });
          };
          da.process_offlineRendering = function (K, R, Z, pa, Oa) {
            console.log("Starting offline rendering process...");
            Ra.Wn();

            if (pa) {
              console.log("Drawing image to canvas...");
              fa.fn.drawImage(mb.tb(), 0, 0);
              mb.tb().parentNode.insertBefore(fa.Ab, mb.tb());
              fa.Ab.setAttribute("class", "jeefitMask");
            }

            da.set_model(R, function () {
              console.log("Model set successfully");
              da.set_materials(Z, function () {
                console.log("Materials set successfully");
                setTimeout(function () {
                  d(K, pa)
                    .then(function () {
                      console.log("Offline rendering completed successfully");
                      Oa();
                    })
                    .catch(function (error) {
                      console.error(
                        "An error occurred during offline rendering:",
                        error
                      );
                    });

                  Ra.Tn(
                    pa
                      ? function () {
                          console.log("Removing mask...");
                          mb.tb().parentNode.removeChild(fa.Ab);
                        }
                      : !1
                  );
                }, 1);
              });
            });
          };

          da.serialize_detection = function (K) {
            console.log("Serializing detection data...");
            return K.cc();
          };

          da.unserialize_detection = function (K, R, Z) {
            console.log("Unserializing detection data...");
            return fd.Zc(K, R, Z);
          };

          da.do_instantDetection = function (K, R) {
            console.log("Performing instant detection...");
            gd.m(T.pc);
            gd.start(K, R);
          };

          da.relieve_DOM = function (K, R) {
            console.log("Relieving DOM...");
            if (ka.Wb) return !1;
            k(R || 160);
            Ma.isEnabled = !1;
            N && clearTimeout(N);
            N = setTimeout(function () {
              k(J.Ca);
              N = !1;
              F();
            }, K);
            return !0;
          };

          da.switch_slow = function (K, R) {
            console.log("Switching slow mode...");
            if (ka.Wb) return !1;
            "undefined" === typeof R && (R = J.rk);
            N && (k(J.Ca), F(), clearTimeout(N), (N = !1));
            K ? (Ma.isEnabled = !1) : F();
            k(K ? R : J.Ca);
            return !0;
          };

          da.switch_sleep = function (K, R) {
            console.log("Commencer à basculer en mode veille...");
            function Z() {
              console.log("Fin de la commutation en mode veille.");
              da.isBusy = !1;
              K ? ((ub = xa), (xa = ra.va)) : ((xa = ub), u());
            }
            if (ka.Wb || da.isBusy) return R ? Promise.reject() : null;
            if ((K && xa === ra.va) || (!K && xa !== ra.va))
              return R ? Promise.resolve(!1) : !1;
            Ab && (clearInterval(Ab), (Ab = null));
            xa === ra.nc
              ? ((xa = ra.Y), Ba.ra(Da.Ja), Ba.cb(0))
              : xa === ra.mc && ((xa = ra.Ka), Ba.ra(Da.Hb), Ba.cb(1));
            Db.stop();
            var pa = null;
            da.isBusy = !0;
            R ? (pa = Ed(!K).then(Z)) : Z();
            return R ? pa : !0;
          };

          da.set_modelStandalone = function (K, R) {
            console.log("Initialisation du modèle en mode autonome...");
            Ba.oe(!1);
            Kc.instance({
              ld: q,
              url: K.model,
              ac: K.materials,
              Me: function (Z) {
                y(Z);
                R && R();
                Ra.Hg();
                Ba.oe(!0);
                console.log("Modèle en mode autonome initialisé avec succès.");
              },
            });
          };

          da.start_rendering = Ra.Hg;
          da.get_partsNames = function () {
            console.log("Obtention des noms des parties...");
            var partsNames = ab ? ab.sf() : [];
            console.log("Noms des parties obtenus :", partsNames);
            return partsNames;
          };

          da.update_material = function (K, R, Z) {
            console.log("Mise à jour du matériau en cours...");
            if (!ab) {
              console.error("ERREUR : LE MODÈLE N'A PAS ÉTÉ CHARGÉ.");
              return Promise.reject("MODEL_NOT_LOADED");
            }
            var partIndex = -1;
            switch (typeof K) {
              case "number":
                partIndex = K;
                break;
              case "string":
                partIndex = ab.sf().findIndex(function (partName) {
                  return partName.includes(K);
                });
                if (partIndex === -1) {
                  console.error("ERREUR : LA PARTIE N'A PAS ÉTÉ TROUVÉE.");
                  return Promise.reject("PART_NOT_FOUND");
                }
                break;
              default:
                console.error("ERREUR : IDENTIFIANT DE PARTIE INVALIDE.");
                return Promise.reject("INVALID_PART_ID");
            }
            void 0 === Z && (Z = !0);
            ab.Xj(partIndex, R, Z);
            console.log("Mise à jour du matériau terminée.");
            return Promise.resolve();
          };

          da.set_model = function (K, R, Z) {
            if (ab) {
              console.log("Chargement du modèle en cours...");
              K = b([J.ea, J.wa, J.Wd + "/", K]);
              ab.replace(
                K,
                function () {
                  console.log("Modèle chargé avec succès.");
                  R && R(ab.hl());
                },
                Z
              );
            } else {
              console.error("ERREUR : LE MODÈLE N'EXISTE PAS.");
            }
          };

          da.update_tweaker = function (K) {
            console.log("Mise à jour du réglage en cours...");
            m(K, !1);
            console.log("Réglage mis à jour avec succès.");
          };

          da.set_tweaker = function (K, R) {
            function Z(pa) {
              m(pa, !0);
              R && R();
            }
            "string" === typeof K ? V(J.ea + J.wa + J.Po + "/" + K, Z) : Z(K);
          };
          da.get_tweaker = function () {
            return {
              preOffset: tb,
              preScale: Ub,
              rx: t,
              beginBendZ: v,
              bendStrength: Vb,
              maskBranchStartEnd: Wb,
            };
          };
          da.get_materialsSpec = function () {
            return ab ? ab.di() : Promise.reject("NOT_READY");
          };
          da.set_materials = function (K, R) {
            if (ab) {
              var Z = b([J.ea, J.wa, J.Vd + "/"]);
              K = K.map(function (pa) {
                var Oa = pa;
                "string" === typeof pa &&
                  ((Oa = Z + pa), (Oa = Oa.replace(/([^:])\/\//, "$1/")));
                return Oa;
              });
              ab.xg(K, R);
            }
          };
          da.replace_material = function (K, R) {
            if (ab)
              return ab.di().then(function (Z) {
                Z = Object.assign({ isReplaced: !0 }, Z[R]);
                ab.Xj(R, K, !0);
                return Z;
              });
          };
        }
        function I() {
          ha.Xg(Ac.Ll);
          Ra.Yc();
          J.Zb && (Ea.reset(), za.La.oh(Fa.V), za.La.nh());
          da.ready = !0;
          Bc.forEach(function (K) {
            K();
          });
          Bc.splice(0);
        }
        function u() {
          Ob.reset();
          Db.stop();
          Ea.ba();
          g(0);
        }
        function y(K) {
          ab && (Ba.Nn(ab), ab.remove());
          Ba.lk(K);
          ab = K;
        }
        function A() {
          tb = [0, 0, 0];
          Ub = 1;
          Vb = v = t = 0;
          Wb = J.Oc;
        }
        function k(K) {
          r = K;
          Db.update({ Ca: r });
        }
        function g(K) {
          Ma.Bb = -1;
          if (Xa.isEnabled) Ma.Bb = Xa.bc;
          else if (lb.isEnabled) Ma.Bb = lb.bc;
          else if (Ma.isEnabled) {
            if (!L()) return;
            Ma.Bb = xa === ra.Y ? Ob.X() : 1;
          } else if (((Ma.Bb = J.bd[0]), !L())) return;
          Ea.ba();
          if (!lb.isEnabled)
            for (var R = 0; R < Ma.Bb; ++R)
              aa.set("s64"),
                la.Df.J(0.25 * ia.width, ca.ai()),
                la.kb.h(0),
                T.Qc.h(1),
                Y.l(!1, !1),
                ca.Aa(la.Df),
                Xa.isEnabled && 0 === (R + 1) % Xa.Ug && n();
          Xa.isEnabled
            ? (Xa.D && Xa.D(),
              (Xa.isEnabled = !1),
              c.flush(),
              xa !== ra.va && Db.qg(g))
            : (Ba.animate(K),
              la.mg &&
                Math.abs(ta - Da.Fi) > Da.Mj &&
                J.Zb &&
                xa === ra.Y &&
                (Ea.ba(), n(), Ea.aa()),
              lb.isEnabled ||
                (Ma.isEnabled &&
                  (Ob.Qj(),
                  (R = Ob.Yh(1)),
                  (Ma.lh = R),
                  (Ma.Ge = S(J.pk, R)),
                  J.Zb &&
                    xa === ra.Y &&
                    ((Da.Mj = S(J.Gi, R)),
                    (Da.Xc = S(J.$m, R)),
                    (Da.Xc = Math.min(Da.Xc, 0.5)))),
                (ta = K),
                xa !== ra.va && Db.qg(g)));
        }
        function F() {
          ta = Jc.mf();
          Ma.isEnabled = !0;
        }
        function L() {
          var K = 15;
          if (!Fa.Md) {
            if (!Fa.element.videoWidth)
              return Db.stop(), da.request_cameraVideoStream().then(u), !1;
            var R = Fa.element.currentTime;
            if (!R) return !0;
            K = R - Lc;
            0 > K && (Lc = R);
            if (1e3 * K < J.cp) return !0;
          }
          Fa.V.refresh();
          Lc += K;
          Fa.ud = K;
          Ha = !0;
          Ea.ba();
          aa.set("s0");
          T.ng.J();
          T.Qc.Tk(0);
          Y.l(!0, !0);
          aa.set("s62");
          la.kb.J();
          Fa.V.h(0);
          Y.l(!1, !1);
          null !== la.Kb &&
            (aa.set("s63"), la.$c.u(), la.kb.h(0), la.Kb.h(1), Y.l(!1, !1));
          return !0;
        }
        function D() {
          la.bk = ba.instance({
            isPot: !0,
            isLinear: !0,
            isFloat: !1,
            url: J.ea + J.wa + J.ep,
          });
          var K = {
            isPot: !1,
            isLinear: !0,
            isFloat: !1,
            width: ia.width,
            height: ia.height,
          };
          la.kb = ba.instance(K);
          la.$c = ba.instance(K);
          ka.Nj.push(la.kb, la.$c);
          la.Df = Id.instance({});
          J.Sd &&
            (qc = ba.instance({
              isPot: !1,
              isFloat: !1,
              isLinear: !0,
              url:
                (J.Sf || -1 !== J.Rf.indexOf("//") ? "" : J.ea + J.wa) + J.Rf,
            }));
        }
        function G() {
          function K() {
            return {
              width: 3,
              height: 1,
              isFloat: !0,
              isPot: !1,
              array: new Float32Array([0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            };
          }
          var R = {
            width: 3,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          };
          T.Qc = Mc.instance(K());
          T.ng = ba.instance(K());
          T.pc = ba.instance(K());
          T.ae = Mc.instance(K());
          T.$e = ba.instance(R);
          R = {
            width: 2,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]),
          };
          T.Yg = ba.instance(R);
          T.ye = ba.instance(R);
          Da.be = ba.instance({
            width: 1,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0, 0, 0]),
          });
        }
        function e(K) {
          la.mg = K;
          if (Ha) {
            Ha = !1;
            aa.set("s70");
            T.Yg.J();
            T.ye.h(2);
            var R = S(J.Vk, Ob.Yh(0.5));
            aa.C("u68", R);
            T.ng.h(1);
            aa.C("u69", 1e3 * Fa.ud);
            Y.l(!1, !1);
            aa.set("s71");
            T.ye.u();
            T.Yg.h(0);
            Y.l(!1, !1);
          }
          K.h(0);
          T.Qc.sj(1);
          c.viewport(0, 0, 1, 1);
          aa.set("s65");
          aa.Dg("u47", hd.get(0));
          Y.l(!1, !1);
          aa.set("s66");
          c.viewport(1, 0, 2, 1);
          Y.l(!1, !1);
          T.$e.J();
          aa.set("s67");
          aa.O("u58", J.He[0] * Ma.Ge, J.He[1]);
          aa.C("u61", Ma.lh);
          T.Qc.h(0);
          T.ae.h(1);
          Y.l(!1, !1);
          aa.set("s68");
          T.ae.sj(1);
          T.$e.h(0);
          T.ye.h(2);
          T.Qc.h(3);
          Y.l(!1, !1);
          aa.set("s69");
          T.ae.h(0);
          T.pc.u();
          Y.l(!1, !1);
        }
        function n() {
          Da.Fi = ta;
          Da.be.J();
          aa.set(H.wi ? "s73" : "s72");
          la.mg.h(0);
          Y.l(!1, !1);
          za.La.ak(Fa.V, Da.be, Da.Xc);
        }
        function z() {
          return new Promise(function (K) {
            V(id(), function (R) {
              R = JSON.parse(R);
              if (R.exportData) {
                var Z = R.exportData;
                H.ab = H.ab || Z.rotationEulerAnglesFactors;
                H.Cc = H.Cc || Z.deformScaleXFactor;
                H.ta = H.ta || Z.translationScalingFactors;
                H.Kh = Z.dyOffset || 0;
                H.Ih = Z.dsOffset || 0;
                H.wi = Z.isLThetaSplitCosSin || !1;
              }
              ca = new lc({ Nc: R.layers, Zd: "gpuRawAvg", Yd: e });
              K();
            });
          });
        }
        function P(K) {
          a(K);
          K = J.width;
          var R = J.height;
          Q.ob[0] = 1;
          Q.ob[1] = K / R;
          hd.m({
            $d: J.scanOverlapFactors,
            Pi: J.scanNScaleLevels,
            da: K,
            Tb: R,
            kj: J.scanScale0Factor,
            ta: H.ta,
            rg: !0,
          });
          Xb = K > R ? [K / R, 1] : [1, R / K];
          ka.Oa = !0;
        }
        function B() {
          aa.j("s64", [
            { type: "1i", name: "u1", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "2f", name: "u42", value: Q.ob },
            { type: "1f", name: "u43", value: H.Cc },
            { type: "1f", name: "u45", value: H.Kh },
            { type: "1f", name: "u44", value: H.Ih },
          ]);
          aa.j("s65", [
            { type: "1i", name: "u46", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "1f", name: "u51", value: J.No },
            { type: "1f", name: "u52", value: J.ol },
            {
              type: "3f",
              name: "u48",
              value: [H.ta[0] * Q.ob[0], H.ta[1] * Q.ob[1], H.ta[2]],
            },
            {
              type: "3f",
              name: "u49",
              value: [J.oc[0][0], J.oc[1][0], J.oc[2][0]],
            },
            {
              type: "3f",
              name: "u50",
              value: [J.oc[0][1], J.oc[1][1], J.oc[2][1]],
            },
          ]);
          aa.j("s66", [
            { type: "1i", name: "u46", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "2f", name: "u55", value: J.En },
            { type: "3f", name: "u53", value: H.ab },
            { type: "3f", name: "u54", value: J.Pj },
            { type: "1f", name: "u56", value: J.Ml },
          ]);
          aa.j("s67", [
            { type: "1i", name: "u41", value: 0 },
            { type: "1i", name: "u57", value: 1 },
            { type: "2f", name: "u58", value: J.He },
            { type: "1f", name: "u59", value: J.Un },
            { type: "1f", name: "u60", value: J.Dn },
          ]);
          aa.j("s68", [
            { type: "1i", name: "u57", value: 1 },
            { type: "1i", name: "u62", value: 0 },
            { type: "1i", name: "u63", value: 2 },
            { type: "1i", name: "u64", value: 3 },
            { type: "2f", name: "u42", value: Q.ob },
            { type: "1f", name: "u66", value: ca.ai() },
            { type: "2f", name: "u65", value: J.Qn },
          ]);
          aa.j("s69", [
            { type: "1i", name: "u41", value: 0 },
            { type: "1f", name: "u67", value: J.Xn },
          ]);
          aa.j("s70", [
            { type: "1i", name: "u46", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "1i", name: "u63", value: 2 },
            { type: "3f", name: "u53", value: H.ab },
            { type: "3f", name: "u54", value: J.Pj },
          ]);
          aa.j("s71", [
            { type: "1i", name: "u63", value: 0 },
            { type: "2f", name: "u70", value: J.Oo },
            { type: "2f", name: "u71", value: J.Vn },
          ]);
          aa.j("s72", [{ type: "1i", name: "u46", value: 0 }]);
          aa.j("s73", [{ type: "1i", name: "u46", value: 0 }]);
          aa.j("s63", [
            { type: "1i", name: "u1", value: 0 },
            { type: "1i", name: "u72", value: 1 },
          ]);
        }
        function E(K, R, Z) {
          var pa = 0 === Z,
            Oa = a(pa);
          J.width = K;
          J.height = R;
          P(pa);
          B();
          ka.Nj.forEach(function (pb) {
            pb.resize(K, R);
          });
          Z = pa ? 1 : Z;
          ha.resize(Oa.width * Z, Oa.height * Z);
          Ra.Yc();
          gb.Eg(
            Fa.element.videoWidth || Fa.element.width,
            Fa.element.videoHeight || Fa.element.height
          );
          gb.Lg();
          gb.Kj();
        }
        function M() {
          Db.stop();
          ka.hb && (clearTimeout(ka.hb), (ka.hb = null));
          if (!ka.Wb) {
            var K = ka.width,
              R = ka.height;
            if (J.width === K && J.height === R) u();
            else if (xa !== ra.Y && xa !== ra.Ka) ka.hb = setTimeout(M, J.ij);
            else {
              var Z = "undefined" === typeof Eb ? !1 : Eb.get_mode(),
                pa = xa;
              xa = ra.va;
              ka.Wb = !0;
              Xa.isEnabled = !0;
              Xa.D = function () {
                Xa.isEnabled = !1;
                ka.Wb = !1;
                F();
                k(J.Ca);
                N && clearTimeout(N);
                N = !1;
                xa = pa;
              };
              E(K, R, 0);
              u();
              xa === ra.Ka && ((xa = ra.Y), da.switch_viewer3D(!0, !1));
              Z && Eb.switch_mode(Z);
            }
          }
        }
        var t,
          v,
          Q = { ob: [-1, -1] },
          X = null,
          U = [0.5, 0, 0, 0.5],
          ia = { width: -1, height: -1 },
          O = { width: -1, height: -1, hb: null, Wb: !1, Oa: !1, Nj: [] },
          ka = Object.assign({}, O),
          Qa = [0, J.ce[1], J.ce[2]],
          H = {
            ab: [-J.ab[0], -J.ab[1], J.ab[2]],
            Cc: J.Cc,
            ta: J.ta,
            Kh: 0,
            Ih: 0,
            wi: !1,
          },
          r = J.Ca,
          N = null,
          ca = null,
          fa = { Jb: null, qc: null, Ab: null, wq: null };
        a(!0);
        var ma = [0, 0, 0],
          ya = 1,
          qa = 0,
          oa = { kb: null, $c: null, Df: null, bk: null, mg: null, Kb: null },
          la = Object.assign({}, oa),
          T = { ng: null, pc: null, ae: null, $e: null, Yg: null, ye: null },
          ta = 0,
          Ha = !1,
          bb = {
            Ja: null,
            Hb: null,
            Yf: null,
            Fi: 0,
            Mj: J.Gi[1],
            Xc: 0.1,
            be: null,
          },
          Da = Object.assign({}, bb),
          Ta = !1,
          Va = !1,
          Ma = { isEnabled: !0, Ge: 1, Bb: -1, lh: 1 },
          ra = { va: -1, Y: 0, Ka: 1, mc: 2, nc: 3 },
          xa = ra.Y,
          Ab = null,
          ub = ra.Y,
          Xa = { isEnabled: !1, bc: 1, Ug: 3, D: null },
          lb = { isEnabled: !1, pa: null, bc: 0 },
          qc = null,
          Xb = -1,
          cc = !1,
          rc = !1,
          Ya = !1,
          sc = [0, 0, 0],
          ea = 1,
          Aa,
          hb,
          Na,
          tb = [0, 0, 0],
          Ub = 1,
          Vb = (v = t = 0),
          Wb = J.Oc,
          Cc = [0, 0, 0],
          nb = { scale: 1, offsetX: 0, offsetY: 0 },
          Lc = 0,
          Ra = {
            m: function () {
              aa.uc([
                {
                  id: "s62",
                  name: "_",
                  v: "attribute vec2 a0;uniform mat2 u40;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5)+u40*a0;}",
                  K: ["a0"],
                  S: [2],
                  g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                  i: ["u1", "u40"],
                  precision: "lowp",
                },
                {
                  id: "s64",
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                  v: "attribute vec2 a0;uniform sampler2D u41;uniform vec2 u42;uniform float u43,u44,u45;const vec2 h=vec2(.16,.5),i=vec2(.5,.5),j=vec2(.84,.5),q=vec2(.5,.5);varying vec2 vv0;void main(){vec4 b=texture2D(u41,h);vec2 c=b.gb,a=b.a*u42;vec4 l=texture2D(u41,i);float m=l.y;vec2 n=vec2(mix(1.,1./cos(m),u43),1.);a*=n,a*=1.+u44;vec2 o=a0*.5;float d=texture2D(u41,j).r,e=cos(d),f=sin(d);mat2 g=mat2(e,f,-f,e);vec2 p=g*o;c+=vec2(-.5,-.5)*a*(g*vec2(0.,u45)),vv0=c+p*a,gl_Position=vec4(a0,0.,1.);}",
                  K: ["a0"],
                  S: [2],
                  i: "u1 u41 u42 u43 u44 u45".split(" "),
                  precision: "lowp",
                },
                {
                  id: "s65",
                  name: "_",
                  v: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                  g: "uniform sampler2D u46,u41;uniform vec3 u47,u48,u49,u50;uniform float u51,u52;const vec4 e=vec4(.25,.25,.25,.25);const vec2 f=vec2(.16,.5),g=vec2(.5,.5),h=vec2(.83,.5);const vec3 i=vec3(1.,1.,1.);void main(){vec4 j=texture2D(u46,vec2(.625,.625)),k=texture2D(u46,vec2(.875,.625));float l=dot(j-k,e);bool m=l>u52;vec4 a=texture2D(u41,f);m?a.r=2.:a.r>u51?a.r=0.:a.r>1.9?a.r+=1.:0.;if(a.r<.9)a=vec4(1.,u47);else{float n=dot(e,texture2D(u46,vec2(.875,.875))),o=dot(e,texture2D(u46,vec2(.125,.625))),p=dot(e,texture2D(u46,vec2(.375,.625))),b=texture2D(u41,h).r,c=cos(b),d=sin(b);vec2 q=mat2(c,d,-d,c)*vec2(n,o);float r=texture2D(u41,g).a;vec3 s=mix(u49,u50,r*i);a.r*=step(1.9,a.r),a.gba+=vec3(q,p)*u48*s*a.a;}gl_FragColor=a;}",
                  i: "u46 u41 u47 u51 u48 u52 u49 u50".split(" "),
                },
                {
                  id: "s66",
                  name: "_",
                  g: "uniform sampler2D u46,u41;uniform vec3 u53,u54;uniform vec2 u55;uniform float u56;const vec4 v=vec4(1.),f=vec4(0.),e=vec4(.25);const vec2 g=vec2(.16,.5),h=vec2(.5,.5),i=vec2(.84,.5);varying vec2 vv0;void main(){float k=step(vv0.x,.5);vec4 l=texture2D(u41,g);if(l.r<1.9){gl_FragColor=f;return;}float m=dot(texture2D(u46,vec2(.125,.125)),e),a=smoothstep(u55.x,u55.y,m);vec4 n=texture2D(u41,h);float o=n.a;a=mix(a,o,.3);float p=dot(e,texture2D(u46,vec2(.125,.875))),q=dot(e,texture2D(u46,vec2(.375,.875))),r=dot(e,texture2D(u46,vec2(.625,.875)));vec3 s=vec3(p,q,r),b=u54+s*u53;float c=texture2D(u41,i).r,d=b.z*u56;c+=d,b.z-=d;vec4 t=vec4(b,a),u=vec4(c,0.,0.,0.);gl_FragColor=mix(u,t,k);}",
                  i: "u46 u41 u55 u53 u54 u56".split(" "),
                },
                {
                  id: "s67",
                  name: "_",
                  g: "uniform sampler2D u41,u57;uniform vec2 u58;uniform float u59,u60,u61;const vec4 f=vec4(1.),h=vec4(1.,0.,0.,0.),i=vec4(0.,0.,0.,1.);const vec2 g=vec2(.5,.5);varying vec2 vv0;void main(){vec4 j=vec4(max(.1,1.-u61),0.,0.,0.),k=texture2D(u41,vv0),l=texture2D(u57,vv0),q=texture2D(u41,g),m=texture2D(u57,g);float n=pow(m.a,u60),o=mix(u58.y,u58.x,n),b=step(.66,vv0.x),c=step(.34,vv0.x)*(1.-b);vec4 a=mix(h,i,c);a=mix(a,j,b);vec4 d=max(o*f,a);d*=mix(f,u59*vec4(1.,1.,1.,0.)+vec4(0.,0.,0.,1.),c);vec4 p=k-l;gl_FragColor=p*d;}",
                  i: "u41 u57 u58 u59 u60 u61".split(" "),
                  precision: "highp",
                },
                {
                  id: "s68",
                  name: "_",
                  g: "uniform sampler2D u57,u62,u63,u64;uniform vec2 u42,u65;uniform float u66;const vec4 w=vec4(0.),x=vec4(1.);const vec2 j=vec2(.25,.5),k=vec2(.75,.5),g=vec2(.16,.5),l=vec2(.5,.5);varying vec2 vv0;bool f(float a){return (a<0.||0.<a||a==0.)&&a+1.!=a?false:true;}void main(){float y=step(vv0.x,.33),m=step(.33,vv0.x)*step(vv0.x,.66),z=step(.66,vv0.x);vec4 n=texture2D(u64,l);float b=n.a;b*=texture2D(u63,j).a,b*=texture2D(u63,k).a;vec4 o=texture2D(u57,vv0),p=texture2D(u62,vv0),c=o+p;c.a=mix(c.a,b,m);vec4 e=texture2D(u57,g),q=texture2D(u64,g);vec2 r=e.gb,s=q.gb;float t=e.a;vec2 h=u66*abs(r-s)/(u42*t);float u=max(h.x,h.y),v=smoothstep(u65.x,u65.y,u);vec4 i=texture2D(u64,vv0),a=mix(c,i,v);if(f(a.x)||f(a.y)||f(a.z)||f(a.w)){gl_FragColor=i;return;}gl_FragColor=a;}",
                  i: "u57 u62 u63 u64 u42 u66 u65".split(" "),
                  precision: "highp",
                },
                {
                  id: "s69",
                  name: "_",
                  g: "uniform sampler2D u41;uniform float u67;const vec4 g=vec4(1.);const vec2 f=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u41,vv0);float b=step(vv0.x,.33),c=texture2D(u41,f).g;a.a+=b*a.a*u67*abs(sin(c)),gl_FragColor=a;}",
                  i: ["u41", "u67"],
                  precision: "highp",
                },
                {
                  id: "s70",
                  name: "_",
                  g: "uniform sampler2D u41,u63,u46;uniform vec3 u53,u54;uniform float u68,u69;const vec4 e=vec4(.25);const vec3 g=vec3(1.);const vec2 h=vec2(.5,.5);const vec3 i=vec3(1.,1.,4.);varying vec2 vv0;void main(){vec4 c=texture2D(u41,h);float d=step(vv0.x,.5),a=1.-d;vec4 j=texture2D(u63,vv0);float t=c.a;vec2 k=mix(vec2(.875,.875),vec2(.125,.875),a),l=mix(vec2(.125,.625),vec2(.375,.875),a),m=mix(vec2(.375,.625),vec2(.625,.875),a);float n=dot(e,texture2D(u46,k)),o=dot(e,texture2D(u46,l)),p=dot(e,texture2D(u46,m));vec3 q=mix(i,u53,a),b=q*vec3(n,o,p),r=c.rgb;b=mix(b,u54+b-r,a)/u69;vec4 s=mix(vec4(b,0.),j,vec4(u68*g,0.));gl_FragColor=s;}",
                  i: "u41 u63 u46 u68 u69 u53 u54".split(" "),
                  precision: "highp",
                },
                {
                  id: "s71",
                  name: "_",
                  g: "uniform sampler2D u63;uniform vec2 u70,u71;const vec4 h=vec4(.25,.25,.25,.25);varying vec2 vv0;void main(){float a=step(.5,vv0.x),c=mix(u70.x,u71.x,a),d=mix(u70.y,u71.y,a);vec3 b=texture2D(u63,vv0).rgb;float f=length(b),g=1.-smoothstep(c,d,f);gl_FragColor=vec4(b,g);}",
                  i: ["u63", "u70", "u71"],
                  precision: "highp",
                },
                {
                  id: "s72",
                  name: "_",
                  v: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                  g: "uniform sampler2D u46;const vec4 e=vec4(.25);const float f=3.1415;void main(){float a=dot(texture2D(u46,vec2(.375,.375)),e),b=dot(texture2D(u46,vec2(.625,.375)),e),c=f/2.*dot(texture2D(u46,vec2(.875,.375)),e),d=.75*f*dot(texture2D(u46,vec2(.125,.375)),e);gl_FragColor=vec4(d,a,b,c);}",
                  i: ["u46"],
                },
                {
                  id: "s73",
                  name: "_",
                  v: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                  g: "uniform sampler2D u46;const vec4 e=vec4(.25);const float f=3.1415,g=1e-7;void main(){float b=dot(texture2D(u46,vec2(.875,.375)),e),c=dot(texture2D(u46,vec2(.375,.125)),e),d=f/2.*dot(texture2D(u46,vec2(.625,.375)),e),a=dot(texture2D(u46,vec2(.125,.375)),e),h=dot(texture2D(u46,vec2(.375,.375)),e);a+=(step(0.,a)-.5)*g;float i=atan(h,a);gl_FragColor=vec4(i,b,c,d);}",
                  i: ["u46"],
                },
                {
                  id: "s63",
                  name: "_",
                  g: "uniform sampler2D u1,u72;varying vec2 vv0;vec4 i(vec4 a,sampler2D g){mediump float b=a.b*63.;mediump vec2 c;c.y=floor(floor(b)/8.),c.x=floor(b)-c.y*8.;mediump vec2 d;d.y=floor(ceil(b)/8.),d.x=ceil(b)-d.y*8.;highp vec2 e;e.x=c.x*.125+9.765625e-4+.123047*a.r,e.y=c.y*.125+9.765625e-4+.123047*a.g;highp vec2 f;f.x=d.x*.125+9.765625e-4+.123047*a.r,f.y=d.y*.125+9.765625e-4+.123047*a.g;lowp vec4 j=texture2D(g,e),k=texture2D(g,f),l=mix(j,k,fract(b));return l;}void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=i(a,u72);}",
                  i: ["u1", "u72"],
                },
              ]);
              G();
              Db.m({ vi: !1, Ca: r });
              Ob.m({ bg: 1, n: J.bd[1] - J.bd[0] + 1, Lf: J.bd[0] });
              da.set_videoRotation = function (K) {
                cb.rotate = K;
                da.ready &&
                  (gb.Eg(Fa.element.videoWidth, Fa.element.videoHeight),
                  gb.Lg());
              };
              da.set_viewRotation = function () {};
              da.set_LUT = function (K) {
                return new Promise(function (R) {
                  K
                    ? ba.instance({
                        url: K,
                        isFloat: !1,
                        isFlipY: !1,
                        D: function (Z) {
                          la.Kb = Z;
                          Ra.Yc();
                          R();
                        },
                      })
                    : ((la.Kb = null), Ra.Yc(), R());
                });
              };
              da.resize = function (K, R, Z, pa) {
                da.ready &&
                  (ka.hb && (clearTimeout(ka.hb), (ka.hb = null)),
                  Db.stop(),
                  (Z = Z ? Ac.ff : 1),
                  (ka.width = K * Z),
                  (ka.height = R * Z),
                  (ka.hb = setTimeout(M, pa ? 0 : J.ij)));
              };
              return z();
            },
            Nl: E,
            Ko: function () {
              D();
              P(!0);
              B();
              Ra.Kj();
              x();
              Dc.forEach(function (K) {
                K();
              });
              Dc.splice(0);
              W.model && !da.isBusy ? Ra.Hi(W.model) : J.Lc || I();
              return Promise.resolve();
            },
            gm: function () {
              return ia;
            },
            A: function () {
              return new Promise(function (K, R) {
                da.ready
                  ? (Db.A(),
                    da
                      .switch_sleep(!0, !0)
                      .finally(function () {
                        ca && ca.A();
                        ha.A();
                        mb.A();
                        c && (c = null);
                        ca = null;
                        J.Sf = !1;
                        ab = null;
                        Va = Ta = !1;
                        Ma.isEnabled = !0;
                        Ma.Ge = 1;
                        Ma.Bb = -1;
                        xa = ra.Y;
                        Ab = null;
                        ub = ra.Y;
                        Object.assign(ka, O);
                        Object.assign(Fa, jd);
                        Object.assign(la, oa);
                        Object.assign(Da, bb);
                        da.ready = !1;
                        da.isBusy = !1;
                        da.load_model = null;
                        K();
                      })
                      .catch(function (Z) {
                        R(Z);
                      }))
                  : R("NOT_READY");
              });
            },
            Yc: function () {
              Ba.qj(T.pc, null === la.Kb ? la.kb : la.$c, Da.be, la.bk);
            },
            em: function () {
              return nb;
            },
            yj: function (K) {
              nb = K;
            },
            ue: function () {
              Cc[0] = ma[0] - nb.offsetX;
              Cc[1] = ma[1] + nb.offsetY;
              Cc[2] = ma[2];
              Ba.co(Qa, tb, Cc);
            },
            ve: function () {
              Ba.eo(ya * J.zn, Ub, nb.scale);
            },
            Yj: function () {
              Ba.fo(qa + t);
            },
            Uo: function () {
              Ba.ao(J.gd + v, J.Mb + Vb);
            },
            Wo: function () {
              Ba.bo(Wb);
            },
            we: function () {
              Ra.ue();
              Ra.ve();
              Ra.Yj();
              Ra.Uo();
              Ra.Wo();
            },
            Wn: function () {
              Db.stop();
              Ab && (clearInterval(Ab), (Ab = null));
              lb.isEnabled = !0;
              lb.bc = 0;
              cc = Ba.dm();
              rc = ab.gi();
              Ya = ab.ei();
              ea = Ub;
              sc = tb;
              Aa = Wb;
              hb = v;
              Na = Vb;
              Xa.isEnabled = !1;
              Ba.me(!1);
            },
            Tn: function (K) {
              function R() {
                2 === ++Z &&
                  ((lb.isEnabled = !1),
                  (Ub = ea),
                  (tb = sc),
                  (Wb = Aa),
                  (v = hb),
                  (Vb = Na),
                  Ra.we(),
                  Ba.ra(cc),
                  u(),
                  K && K());
              }
              var Z = 0;
              xa === ra.mc ? (xa = ra.Ka) : xa === ra.nc && (xa = ra.Y);
              Ba.cb(xa === ra.Y ? 0 : 1);
              ab.replace(rc, R);
              ab.xg(Ya, R);
              Ra.Yc();
              Ba.me(!0);
            },
            Kj: function () {
              var K = Math.tan(Fa.jf / 2);
              Ba.pj({
                hf: J.hf / K,
                Yn: K,
                Cn: Fa.$i,
                Ha: J.Ha,
                $f: J.$f,
                ag: J.ag,
                ek: Q.ob,
                jk: J.hp,
                Gc: J.Gc,
                zf: J.zf,
                xf: J.xf,
                yf: J.yf,
                Oc: Wb,
                Ie: J.Ie,
                Ve: J.Ve,
                pg: J.pg,
                jc: J.jc,
                Eo: J.Ej,
                Fo: J.Fj,
                le: J.le,
                kc: J.kc,
                od: J.od,
                Ye: J.Ye,
                Xe: J.Xe,
                We: J.We,
                Le: J.Le,
                Ke: J.ea + J.wa + J.Ke,
                gd: J.gd + v,
                Mb: J.Mb + Vb,
                vf: J.vf,
                dh: J.dh,
                bh: J.bh,
                Be: J.Be,
                np: J.mp,
                Ae: Fa.Ae,
                Sd: J.Sd,
                bn: qc,
                Rd: J.Rd,
                Td: J.Td,
                Qf: J.Qf,
                an: Xb,
                Mg: J.Mg,
              });
            },
            el: function () {
              var K = cb.Ee,
                R = cb.De,
                Z = 1 / Math.tan(0.5 * Fa.jf),
                pa = mb.$() / mb.P();
              Fa.$i = [
                Z,
                0,
                0,
                0,
                0,
                Z / pa,
                0,
                0,
                0,
                0,
                -(R + K) / (R - K),
                -1,
                0,
                0,
                (-2 * K * R) / (R - K),
                0,
              ];
              Fa.Ae = 1 / Math.tan((J.kp * Math.PI) / 360) / Z;
            },
            Eg: function (K, R) {
              X = [0.5, 0.5];
              K = R / K;
              R = mb.$() / mb.P();
              90 === Math.abs(cb.rotate) && (K = 1 / K);
              K > R ? (X[1] *= R / K) : (X[0] *= K / R);
              U[0] = 0;
              U[1] = 0;
              U[2] = 0;
              U[3] = 0;
              switch (cb.rotate) {
                case 0:
                  U[0] = X[0];
                  U[3] = X[1];
                  break;
                case 180:
                  U[0] = -X[0];
                  U[3] = -X[1];
                  break;
                case 90:
                  U[1] = X[0];
                  U[2] = -X[1];
                  break;
                case -90:
                  (U[1] = -X[0]), (U[2] = X[1]);
              }
              J.yi || ((U[0] *= -1), (U[1] *= -1));
              R = X;
              var Z = mc(),
                pa = cb.FOVforced;
              Z =
                ((pa ? pa : Z ? cb.FOVmobile : cb.FOVdesktop) * Math.PI) / 180;
              Z =
                2 *
                Math.atan((Math.max(K, 1 / K) / (16 / 9)) * Math.tan(0.5 * Z));
              Fa.jf =
                2 *
                Math.atan(
                  2 *
                    R[0] *
                    Math.tan(
                      0.5 *
                        (1 < K ? 2 * Math.atan((1 / K) * Math.tan(0.5 * Z)) : Z)
                    )
                );
              Ra.el();
            },
            Lg: function () {
              aa.j("s62", [
                { type: "1i", name: "u1", value: 0 },
                { type: "mat2", name: "u40", value: U },
              ]);
            },
            Cf: function (K, R) {
              return Va
                ? Promise.resolve()
                : new Promise(function (Z, pa) {
                    Ra.ym(K, R);
                    Promise.all([Ra.m(), Ra.zm()])
                      .then(function () {
                        Ra.oi();
                        Va = !0;
                        Z();
                      })
                      .catch(function (Oa) {
                        Rb && Rb("GL_INCOMPATIBLE", "Cannot init ARLOOK");
                        pa(Oa);
                      });
                  });
            },
            ym: function (K, R) {
              fa.Jb = document.createElement("canvas");
              fa.Ab = document.createElement("canvas");
              fa.Ab.width = J.width;
              fa.Ab.height = J.height;
              fa.fn = fa.Ab.getContext("2d");
              da.replace_video = function (Z) {
                Fa.element = Z;
                Fa.Sg.la = Fa.element;
                return !0;
              };
              fa.qc = fa.Jb.getContext("2d");
              da.capture_background = function (Z, pa) {
                Z = "undefined" === typeof Z ? K : Z;
                pa = "undefined" === typeof pa ? R : pa;
                fa.Jb.width = Z;
                fa.Jb.height = pa;
                var Oa = Z / pa,
                  pb = 0,
                  ib = 0;
                if (K / R > Oa) {
                  var Qb = R * Oa;
                  Oa = R;
                  pb = Math.round((K - Qb) / 2);
                } else (Qb = K), (Oa = K / Oa), (ib = Math.round((R - Oa) / 2));
                fa.qc.save();
                fa.qc.translate(Z, 0);
                fa.qc.scale(-1, 1);
                fa.qc.drawImage(Fa.element, pb, ib, Qb, Oa, 0, 0, Z, pa);
                fa.qc.restore();
                Z = document.createElement("canvas");
                Z.width = fa.Jb.width;
                Z.height = fa.Jb.height;
                Z.getContext("2d").drawImage(fa.Jb, 0, 0);
                return Z;
              };
            },
            oi: function () {
              window.CanvasListeners &&
                (Eb.init({ sa: mb.tb() }),
                (da.init_listeners = Ra.oi),
                (da.add_listener = Eb.add_listener),
                (da.remove_listener = Eb.remove_listener),
                (da.animate_swipe = Eb.animate_swipe),
                (da.switch_modeInteractor = Eb.switch_mode),
                (da.get_modeInteractor = Eb.get_mode),
                Eb.add_listener(
                  "move",
                  function (K, R) {
                    xa === ra.Y &&
                      (J.cn &&
                        ((nb.offsetX -= R[0] * J.Ji),
                        (nb.offsetX = Math.min(
                          Math.max(nb.offsetX, -J.Ud),
                          J.Ud
                        ))),
                      (nb.offsetY -= R[1] * J.Ji),
                      (nb.offsetY = Math.min(
                        Math.max(nb.offsetY, -J.Ud),
                        J.Ud
                      )),
                      Ra.ue());
                  },
                  !0
                ).add_listener(
                  "pinch",
                  function (K, R) {
                    xa === ra.Y &&
                      ((nb.scale += R * J.dn),
                      (nb.scale = Math.min(
                        Math.max(nb.scale, J.Ki[0]),
                        J.Ki[1]
                      )),
                      Ra.ve());
                  },
                  !0
                ));
            },
            zm: function () {
              return new Promise(function (K, R) {
                ha.m({
                  Id: !1,
                  cl: !1,
                  expand: !1,
                  sa: mb.tb(),
                  Rb: mb,
                  onload: function () {
                    Da.Hb = pc.instance({
                      Lb: J.ea + J.wa + db.fp,
                      wc: J.ea + J.wa + db.gp,
                      vc: db.ck,
                      xc: db.dk,
                    });
                    J.Zb
                      ? ((Da.Ja = pc.instance({})), za.La.ra(Da.Ja))
                      : (Da.Ja = Da.Hb);
                    Ba.ra(Da.Ja);
                    Da.Yf = J.Zb
                      ? Jd.instance({ Zm: Da.Ja, Xm: Da.Hb })
                      : Da.Hb;
                    K();
                  },
                }) || R("CANNOT_INIT_JE3D");
              });
            },
            Hg: function () {
              Ta || ((Ta = !0), Ra.we(), I(), (ta = 0), J.Lc && u());
            },
            Hi: function (K, R) {
              K = Kc.instance({
                Me: function () {
                  Ra.Hg();
                  R && R();
                },
                ld: q,
                url: K.url,
                ac: K.ac,
              });
              y(K);
            },
            Lj: function () {
              if (J.Zb) {
                var K = Object.assign({}, db, { Db: b([J.ea, J.wa, db.Db]) });
                za.La.ib(K);
              }
            },
          };
        return Ra;
      }
      function Kd(a) {
        var b = document.createElement("link");
        b.setAttribute("href", a);
        "json" === a.split(".").pop().toLowerCase()
          ? (b.setAttribute("rel", "preload"),
            b.setAttribute("as", "fetch"),
            b.setAttribute("type", "application/json"),
            b.setAttribute("crossorigin", ""))
          : b.setAttribute("rel", "prefetch");
        document.head.appendChild(b);
      }
      function id(a) {
        if (!a) {
          a = J.ea;
          var b = J.ad.split("://").shift();
          if ("http" === b || "https" === b) a = "";
        }
        a += J.ad;
        "json" !== a.split(".").pop() && (a += J.neuralNetworkPath);
        return a;
      }
      function kd() {
        return new Promise(function (a, b) {
          Nc && Nc();
          Fa.Md = !1;
          var d = {
              width: {
                min: cb.minWidth,
                max: cb.maxWidth,
                ideal: cb.idealWidth,
              },
              height: {
                min: cb.minHeight,
                max: cb.maxHeight,
                ideal: cb.idealHeight,
              },
              facingMode: { ideal: "user" },
            },
            f = { video: d, audio: !1 };
          Fa.wh = f;
          d && -1 !== Fa.deviceId && nc(f, Fa.deviceId);
          cd(
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia
              ? document.createElement("video")
              : !1,
            function (l) {
              Oc && Oc(l);
              ld(l).then(a).catch(b);
            },
            function (l) {
              Rb && Rb("WEBCAM_UNAVAILABLE", l);
              b(l);
            },
            f
          );
        });
      }
      function ld(a) {
        Fa.element = a;
        a = Fa.element.videoWidth || Fa.element.width;
        var b = Fa.element.videoHeight || Fa.element.height;
        Fa.Sg = { la: Fa.element, isPot: !1, isFloat: !1, isFlipY: !0 };
        Fa.V = ba.instance(Fa.Sg);
        gb.Eg(a, b);
        return gb
          .Cf(a, b)
          .then(function () {
            gb.Lg();
            return gb.Ko();
          })
          .catch(function (d) {
            return Promise.reject(d);
          });
      }
      function Ld() {
        var a = document.createElement("canvas");
        a.width = J.width;
        a.height = J.height;
        Fa.Lh = a.getContext("2d");
        Fa.Md = !0;
        return ld(a);
      }
      function dc(a) {
        return 3 === arguments.length ? this.rb(arguments) : this.set(a);
      }
      function md(a, b) {
        b = Math.floor(b);
        a.r = ((b >> 16) & 255) / 255;
        a.Z = ((b >> 8) & 255) / 255;
        a.b = (b & 255) / 255;
      }
      function Md(a, b) {
        function d(h) {
          void 0 !== h &&
            1 > parseFloat(h) &&
            console.warn(
              "JETHREE.Color: Alpha component of " + b + " will be ignored."
            );
        }
        var f;
        if ((f = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(b))) {
          var l = f[2];
          switch (f[1]) {
            case "rgb":
            case "rgba":
              if (
                (f =
                  /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                    l
                  ))
              ) {
                a.r = Math.min(255, parseInt(f[1], 10)) / 255;
                a.Z = Math.min(255, parseInt(f[2], 10)) / 255;
                a.b = Math.min(255, parseInt(f[3], 10)) / 255;
                d(f[5]);
                return;
              }
              if (
                (f =
                  /^(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                    l
                  ))
              ) {
                a.r = Math.min(100, parseInt(f[1], 10)) / 100;
                a.Z = Math.min(100, parseInt(f[2], 10)) / 100;
                a.b = Math.min(100, parseInt(f[3], 10)) / 100;
                d(f[5]);
                return;
              }
              break;
            case "hsl":
            case "hsla":
              if (
                (f =
                  /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                    l
                  ))
              ) {
                l = parseFloat(f[1]) / 360;
                var p = parseInt(f[2], 10) / 100,
                  w = parseInt(f[3], 10) / 100;
                d(f[5]);
                a.$n(l, p, w);
                return;
              }
          }
        } else if ((f = /^#([A-Fa-f0-9]+)$/.exec(b))) {
          f = f[1];
          l = f.length;
          if (3 === l) {
            a.r = parseInt(f.charAt(0) + f.charAt(0), 16) / 255;
            a.Z = parseInt(f.charAt(1) + f.charAt(1), 16) / 255;
            a.b = parseInt(f.charAt(2) + f.charAt(2), 16) / 255;
            return;
          }
          if (6 === l) {
            a.r = parseInt(f.charAt(0) + f.charAt(1), 16) / 255;
            a.Z = parseInt(f.charAt(2) + f.charAt(3), 16) / 255;
            a.b = parseInt(f.charAt(4) + f.charAt(5), 16) / 255;
            return;
          }
        }
        b &&
          0 < b.length &&
          ((f = Nd[b]),
          void 0 !== f
            ? md(a, f)
            : console.warn("JETHREE.Color: Unknown color " + b));
      }
      function Ec(a, b, d, f) {
        this.F = a || 0;
        this.G = b || 0;
        this.H = d || 0;
        this.T = void 0 !== f ? f : 1;
      }
      function nd(a, b, d) {
        var f = b.F,
          l = b.G,
          p = b.H;
        b = b.T;
        var w = d.F,
          h = d.G,
          m = d.H;
        d = d.T;
        a.F = f * d + b * w + l * m - p * h;
        a.G = l * d + b * h + p * w - f * m;
        a.H = p * d + b * m + f * h - l * w;
        a.T = b * d - f * w - l * h - p * m;
        return a;
      }
      function ec(a, b) {
        this.x = a || 0;
        this.y = b || 0;
      }
      function Za(a, b, d) {
        this.x = a || 0;
        this.y = b || 0;
        this.z = d || 0;
      }
      function od(a, b) {
        var d = a.x,
          f = a.y,
          l = a.z;
        a.x = f * b.z - l * b.y;
        a.y = l * b.x - d * b.z;
        a.z = d * b.y - f * b.x;
      }
      function fc(a, b, d, f) {
        this.F = a || 0;
        this.G = b || 0;
        this.H = d || 0;
        this.Sa = f || fc.fk;
      }
      function Pc(a, b) {
        this.min = void 0 !== a ? a : new Za(Infinity, Infinity, Infinity);
        this.max = void 0 !== b ? b : new Za(-Infinity, -Infinity, -Infinity);
      }
      function Fc(a) {
        return new Za().dd(a.min, a.max).Fa(0.5);
      }
      function Od(a, b) {
        a.min.min(b);
        a.max.max(b);
      }
      function gc() {
        this.elements = new Float32Array([
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);
        0 < arguments.length &&
          console.error(
            "JETHREE.Matrix4: the constructor no longer reads arguments. use .set() instead."
          );
      }
      function pd(a, b, d) {
        var f = b.elements,
          l = d.elements;
        d = a.elements;
        b = f[0];
        var p = f[4],
          w = f[8],
          h = f[12],
          m = f[1],
          q = f[5],
          x = f[9],
          I = f[13],
          u = f[2],
          y = f[6],
          A = f[10],
          k = f[14],
          g = f[3],
          F = f[7],
          L = f[11];
        f = f[15];
        var D = l[0],
          G = l[4],
          e = l[8],
          n = l[12],
          z = l[1],
          P = l[5],
          B = l[9],
          E = l[13],
          M = l[2],
          t = l[6],
          v = l[10],
          Q = l[14],
          X = l[3],
          U = l[7],
          ia = l[11];
        l = l[15];
        d[0] = b * D + p * z + w * M + h * X;
        d[4] = b * G + p * P + w * t + h * U;
        d[8] = b * e + p * B + w * v + h * ia;
        d[12] = b * n + p * E + w * Q + h * l;
        d[1] = m * D + q * z + x * M + I * X;
        d[5] = m * G + q * P + x * t + I * U;
        d[9] = m * e + q * B + x * v + I * ia;
        d[13] = m * n + q * E + x * Q + I * l;
        d[2] = u * D + y * z + A * M + k * X;
        d[6] = u * G + y * P + A * t + k * U;
        d[10] = u * e + y * B + A * v + k * ia;
        d[14] = u * n + y * E + A * Q + k * l;
        d[3] = g * D + F * z + L * M + f * X;
        d[7] = g * G + F * P + L * t + f * U;
        d[11] = g * e + F * B + L * v + f * ia;
        d[15] = g * n + F * E + L * Q + f * l;
        return a;
      }
      function Qc(a, b, d, f, l, p) {
        this.a = a;
        this.b = b;
        this.c = d;
        this.Ga = f instanceof Za ? f : new Za();
        this.ze = Array.isArray(f) ? f : [];
        this.color = l instanceof dc ? l : new dc();
        this.$g = Array.isArray(l) ? l : [];
        this.$b = void 0 !== p ? p : 0;
      }
      function Pd(a, b, d) {
        var f = new XMLHttpRequest();
        f.open("GET", a, !0);
        var l = (f.withCredentials = !1);
        f.onreadystatechange = function () {
          404 !== f.status || l || ((l = !0), d && d(404));
          if (4 === f.readyState && 200 === f.status) {
            var p = null;
            try {
              p = JSON.parse(f.responseText);
            } catch (w) {
              d && d(-1);
            }
            b && p && b(p);
          }
        };
        f.onerror = function () {
          d && d(0);
        };
        f.send();
      }
      function Rc(a, b, d) {
        "object" === typeof a ? b(a) : Pd(a, b, d);
      }
      function Qd(a) {
        return new Promise(function (b, d) {
          Rc(a, b, d);
        });
      }
      function Rd(a, b) {
        for (var d = new Za(), f = new Za(), l = 0, p = b.length; l < p; l++) {
          var w = b[l],
            h = a[w.a],
            m = a[w.b],
            q = a[w.c];
          h &&
            m &&
            q &&
            (d.gb(q, m),
            f.gb(h, m),
            od(d, f),
            0 !== d.Kf() && (d.normalize(), w.Ga.N(d)));
        }
      }
      function Sd(a, b) {
        for (var d = Array(a.length), f = 0, l = a.length; f < l; ++f)
          d[f] = new Za();
        f = new Za();
        l = new Za();
        for (var p = 0, w = b.length; p < w; ++p) {
          var h = b[p],
            m = a[h.a],
            q = a[h.b],
            x = a[h.c];
          m &&
            q &&
            x &&
            (f.gb(x, q),
            l.gb(m, q),
            od(f, l),
            d[h.a].add(f),
            d[h.b].add(f),
            d[h.c].add(f));
        }
        f = 0;
        for (a = a.length; f < a; ++f) d[f].normalize();
        a = 0;
        for (f = b.length; a < f; ++a)
          (h = b[a]),
            (l = h.ze),
            (p = d[h.a]),
            (w = d[h.b]),
            (h = d[h.c]),
            p &&
              w &&
              h &&
              (3 === l.length
                ? (l[0].N(p), l[1].N(w), l[2].N(h))
                : ((l[0] = p.clone()), (l[1] = w.clone()), (l[2] = h.clone())));
        return d;
      }
      function Td(a, b, d, f) {
        function l(n) {
          G.N(b[n]);
          e.N(G);
          var z = h[n];
          L.N(z);
          L.sub(G.Fa(G.qd(z))).normalize();
          var P = e.x,
            B = e.y,
            E = e.z,
            M = z.x,
            t = z.y;
          z = z.z;
          D.x = B * z - E * t;
          D.y = E * M - P * z;
          D.z = P * t - B * M;
          P = 0 > D.qd(m[n]) ? -1 : 1;
          w[4 * n] = L.x;
          w[4 * n + 1] = L.y;
          w[4 * n + 2] = L.z;
          w[4 * n + 3] = P;
        }
        for (
          var p = a.length,
            w = new Float32Array(4 * p),
            h = Array(p),
            m = Array(p),
            q = 0;
          q < p;
          q++
        )
          (h[q] = new Za()), (m[q] = new Za());
        var x = new Za(),
          I = new Za(),
          u = new Za(),
          y = new ec(),
          A = new ec(),
          k = new ec(),
          g = new Za(),
          F = new Za();
        f.forEach(function (n) {
          var z = n.a,
            P = n.b;
          n = n.c;
          x.N(a[z]);
          I.N(a[P]);
          u.N(a[n]);
          y.N(d[z]);
          A.N(d[P]);
          k.N(d[n]);
          var B = I.x - x.x,
            E = u.x - x.x,
            M = I.y - x.y,
            t = u.y - x.y,
            v = I.z - x.z,
            Q = u.z - x.z,
            X = A.x - y.x,
            U = k.x - y.x,
            ia = A.y - y.y,
            O = k.y - y.y,
            ka = 1 / (X * O - U * ia);
          g.set(
            (O * B - ia * E) * ka,
            (O * M - ia * t) * ka,
            (O * v - ia * Q) * ka
          );
          F.set(
            (X * E - U * B) * ka,
            (X * t - U * M) * ka,
            (X * Q - U * v) * ka
          );
          h[z].add(g);
          h[P].add(g);
          h[n].add(g);
          m[z].add(F);
          m[P].add(F);
          m[n].add(F);
        });
        var L = new Za(),
          D = new Za(),
          G = new Za(),
          e = new Za();
        f.forEach(function (n) {
          l(n.a);
          l(n.b);
          l(n.c);
        });
        return w;
      }
      function qd(a, b, d, f) {
        return Math.sqrt((a - d) * (a - d) + (b - f) * (b - f));
      }
      var W = {
          zh: !0,
          Lp: !1,
          Mp: !1,
          nl: !1,
          yh: !1,
          Kp: !1,
          Qa: !1,
          Id: !1,
          yq: !1,
          ea: "",
          Mi: "",
          Lk: 700,
          Kk: 200,
          Ah: !1,
          Yo: !1,
          Zo: !1,
          Xo: !1,
          sk: 3,
          Ob: !1,
          kh: !0,
          Lb: "images/backgrounds/interior2.jpg",
          wc: "images/backgrounds/interior_light.jpg",
          Nk: [256, 256, 512, 512],
          vc: 2.1,
          xc: 8,
          Mk: [64, 128, 256, 256],
          Fm: [60, 96, 160, 250],
          Em: [8, 12, 18, 40],
          Rc: 2.2,
          jg: 1,
          Ne: 300,
          ph: 500,
          Oe: 50,
          Xk: 0,
          Yk: 0,
          Ap: 45,
          Cp: 1,
          Bp: 1e3,
          qh: 20,
          pp: 10,
          rp: 10,
          sp: 5,
          yn: 0.1,
          Ui: 20,
          Xi: 100,
          Yi: 100,
          xn: -Math.PI / 3,
          wn: Math.PI / 3,
          Wi: 0,
          Oj: 0,
          ud: [40, 32, 16, 16],
          qk: [0, 0.87, 0.92, 0.9],
          tn: 2,
          nn: 100,
          ga_: !1,
          tk: 16,
          uk: 0.4,
          wk: [0.72, 0.73, 0.72, 0.74],
          Gk: 1.2,
          Dk: [0.5, 0.5, 0.5, 1],
          Ik: 140,
          Hk: 280,
          Jk: 1.2,
          xk: 20,
          yk: 40,
          Fk: [6, 9, 9, 12],
          Ck: [0.03, 0.02, 0.02, 0.018],
          Bk: [0.35, 0.35, 0.4, 0.5],
          zk: [0.2, 0.2, 0.2, 0.2],
          vk: [0.1, 0.15, 0.15, 0.15],
          Ek: [200, 200, 150, 120],
          Ak: [1, 2, 3, 5],
          Go: 1.1,
          Rq: [0.25, 0.5, 1, 2],
          Sq: 256,
          Qq: 256,
          Pq: 200,
          Ho: [40, 80, 200, 500],
          Io: [35, 45, 80, 120],
          il: !0,
          jl: "CCW",
        },
        rd = {},
        aa = (function () {
          function a(t, v, Q) {
            v = t.createShader(v);
            t.shaderSource(v, Q);
            t.compileShader(v);
            return t.getShaderParameter(v, t.COMPILE_STATUS) ? v : null;
          }
          function b(t, v, Q) {
            v = a(t, t.VERTEX_SHADER, v);
            Q = a(t, t.FRAGMENT_SHADER, Q);
            t === c && h.push(v, Q);
            var X = t.createProgram();
            t.attachShader(X, v);
            t.attachShader(X, Q);
            t.linkProgram(X);
            return X;
          }
          function d(t) {
            return ["float", "sampler2D", "int"]
              .map(function (v) {
                return "precision " + t + " " + v + ";\n";
              })
              .join("");
          }
          function f(t, v) {
            v.R = v.R ? !0 : !1;
            if (!v.R) {
              v.v =
                v.v ||
                "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5);}";
              v.K = v.K || ["a0"];
              v.S = v.S || [2];
              v.precision = v.precision || u;
              v.id = x++;
              void 0 !== v.lj &&
                (v.lj.forEach(function (U, ia) {
                  v.g = v.g.replace(U, v.Ia[ia]);
                }),
                v.lj.splice(0));
              v.ah = 0;
              v.S.forEach(function (U) {
                v.ah += 4 * U;
              });
              var Q = d(v.precision);
              v.qa = b(t, Q + v.v, Q + v.g);
              v.B = {};
              v.i.forEach(function (U) {
                v.B[U] = t.getUniformLocation(v.qa, U);
              });
              v.attributes = {};
              v.xa = [];
              v.K.forEach(function (U) {
                var ia = t.getAttribLocation(v.qa, U);
                v.attributes[U] = ia;
                v.xa.push(ia);
              });
              if (v.o) {
                t.useProgram(v.qa);
                q = v;
                m = v.id;
                for (var X in v.o) t.uniform1i(v.B[X], v.o[X]);
              }
              v.Oa = !0;
            }
          }
          function l(t) {
            Cb.Cj(M);
            m !== t.id &&
              (M.M(),
              (m = t.id),
              (q = t),
              c.useProgram(t.qa),
              t.xa.forEach(function (v) {
                0 !== v && c.enableVertexAttribArray(v);
              }));
          }
          function p(t, v, Q) {
            f(t, v, Q);
            t.useProgram(v.qa);
            t.enableVertexAttribArray(v.attributes.a0);
            m = -1;
            return (q = v);
          }
          function w() {
            return {
              g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              i: ["u1"],
              o: { u1: 0 },
            };
          }
          var h = [],
            m = -1,
            q = null,
            x = 0,
            I = !1,
            u = "highp",
            y = ["u1"],
            A = ["u0"],
            k = { u1: 0 },
            g = { u0: 0 },
            F = { u1: 0, u2: 1 },
            L = { u1: 0, u3: 1 },
            D = ["u1", "u3", "u4"],
            G = { u5: 0 },
            e = ["u6", "u7", "u8", "u9"],
            n = { u6: 0, u7: 1 },
            z = {
              s0: w(),
              s1: {
                g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                i: y,
                o: k,
                precision: "lowp",
              },
              s2: {
                g: "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
                i: ["u1", "u2"],
                o: F,
              },
              s3: {
                g: "uniform sampler2D u1;uniform vec2 u10,u11;varying vec2 vv0;void main(){vec2 a=vv0*u10+u11;gl_FragColor=texture2D(u1,a);}",
                i: ["u1", "u10", "u11"],
                o: k,
                R: !0,
              },
              s4: {
                g: "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
                i: y,
                o: k,
              },
              s5: {
                g: "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
                i: ["u1", "u2"],
                o: F,
              },
              s6: {
                g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
                i: y,
                o: k,
              },
              s7: {
                g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
                i: y,
                o: k,
              },
              s8: {
                g: "uniform sampler2D u0;uniform float u10;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u10;}",
                i: ["u0", "u10"],
                o: g,
              },
              s9: {
                g: "uniform sampler2D u0;uniform float u10;varying vec2 vv0;const vec4 f=vec4(.25),g=vec4(1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u10,f);gl_FragColor=b*g;}",
                i: ["u0", "u10"],
                o: g,
              },
              s10: {
                g: "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
                i: y,
                o: k,
              },
              s11: {
                g: "uniform sampler2D u1,u12;uniform float u13;const vec4 f=vec4(1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u12,vv0);gl_FragColor=mix(b,a,u13*f);}",
                i: ["u1", "u12", "u13"],
                o: { u1: 0, u12: 1 },
              },
              s12: {
                g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u14)+texture2D(u1,vv0+u14*vec2(1.,-1.))+texture2D(u1,vv0+u14*vec2(-1.,-1.))+texture2D(u1,vv0+u14*vec2(-1.,1.)));}",
                i: ["u1", "u14"],
                o: k,
              },
              s13: {
                g: "uniform sampler2D u1;varying vec2 vv0;vec4 f(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),g=exp2(c);vec3 h=clamp(b/g,0.,1.);return vec4(h,(c+128.)/256.);}void main(){vec3 a=texture2D(u1,vv0).rgb;gl_FragColor=f(a);}",
                i: y,
                o: k,
                R: !0,
              },
              s14: {
                g: "uniform sampler2D u1;varying vec2 vv0;vec3 f(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=vec4(f(a),1.);}",
                i: y,
                o: k,
                R: !0,
              },
              s15: {
                g: "uniform sampler2D u1;uniform vec4 u15;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 j(float a){if(a==0.)return vec4(0.,0.,0.,0.);float k=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),l=c+127.,b=(a/exp2(c)-1.)*8388608.,d=l/2.,m=fract(d)*2.,n=floor(d),o=e(b,0.,8.),p=e(b,8.,16.),q=m*128.+e(b,16.,23.),r=k+n;return vec4(o,p,q,r)/255.;}void main(){float a=dot(texture2D(u1,vv0),u15);gl_FragColor=j(a);}",
                i: ["u1", "u15"],
                o: k,
              },
              s16: {
                g: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
                i: A,
                o: g,
                R: !0,
              },
              s17: {
                g: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(f,a);}",
                i: A,
                o: g,
                R: !0,
              },
              s18: {
                g: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.);const float g=.797885,h=.044715;vec4 i(vec4 a){vec4 b=exp(-abs(a)),c=b*b,d=sign(a)*(e-c)/(e+c);return d;}void main(){vec4 a=texture2D(u0,vv0),b=a+h*a*a*a,c=i(g*b);gl_FragColor=.5*a*(e+c);}",
                i: A,
                o: g,
                R: !0,
              },
              s19: {
                g: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-f,a,step(0.,a));}",
                i: A,
                o: g,
                R: !0,
              },
              s20: {
                g: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(a)-f;gl_FragColor=mix(.1*b,a,step(0.,a));}",
                i: A,
                o: g,
              },
              s21: {
                g: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
                i: A,
                o: g,
              },
              s22: {
                g: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=2.*atan(e*texture2D(u0,vv0))/e;}",
                i: A,
                o: g,
                R: !0,
              },
              s23: {
                g: "uniform sampler2D u0,u16;uniform float u17;const vec2 e=vec2(.5);const float f=1e-5;const vec4 g=vec4(1.),i=vec4(0.);varying vec2 vv0;void main(){vec4 a=texture2D(u16,e);float b=u17*u17;vec4 c=max(b*a,f*g);gl_FragColor=texture2D(u0,vv0)/c;}",
                i: ["u0", "u16", "u17"],
                o: { u0: 0, u16: 1 },
                R: !0,
              },
              s24: {
                g: "uniform sampler2D u1;uniform vec2 u18;varying vec2 vv0;void main(){float a=u18.x*u18.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u18.y),f=floor(u18.x*fract(b*u18.y)),g=(f*u18.y+d)/a;gl_FragColor=texture2D(u1,g+c/a);}",
                i: ["u1", "u18"],
                o: k,
              },
              s25: {
                g: "uniform sampler2D u7,u6,u19;varying vec2 vv0;void main(){vec4 a=texture2D(u19,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u7,b),f=texture2D(u6,c);gl_FragColor=d*f;}",
                i: ["u7", "u6", "u19"],
                o: Object.assign({ u19: 2 }, n),
                R: !0,
              },
              s26: {
                g: "uniform float u8,u9;uniform sampler2D u7,u6;varying vec2 vv0;void main(){vec2 b=fract(vv0*u8);float a=u8*u9;vec2 c=(vec2(.5)+floor(a*vv0))/a;vec4 d=texture2D(u7,c),f=texture2D(u6,b);gl_FragColor=d*f;}",
                i: e,
                o: n,
              },
              s27: {
                g: "uniform float u8,u9;uniform vec2 u20;uniform sampler2D u7,u6;varying vec2 vv0;void main(){float a=u8*u9;vec2 b=mod(vv0*u20,vec2(1.)),c=floor(vv0*u20)/u20,d=c+fract(b*u8)/u20,f=(vec2(.5)+floor(a*b))/a;vec4 g=texture2D(u7,f),h=texture2D(u6,d);gl_FragColor=g*h;}",
                i: ["u20"].concat(e),
                o: n,
                R: !0,
              },
              s28: {
                g: "uniform float u8,u9;uniform sampler2D u7,u6,u22,u23,u24,u25;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 c=fract(vv0*u8),d=vv0;float h=u8*u9;d=(.5+floor(h*vv0))/h;vec4 l=texture2D(u7,d),m=texture2D(u6,c),a=texture2D(u25,d);a=floor(.5+a*255.);vec4 n=texture2D(u22,c),o=texture2D(u23,c),p=texture2D(u24,c),i=step(-g,-a),b=e-i,j=b*step(-e-g,-a);b*=e-j;vec4 k=b*step(-2.*e-g,-a);b*=e-k;vec4 q=b,r=i*m+j*n+k*o+q*p;gl_FragColor=l*r;}",
                i: ["u25", "u22", "u23", "u24"].concat(e),
                o: Object.assign({ u25: 3, u22: 4, u23: 5, u24: 6 }, n),
                R: !0,
              },
              s29: {
                g: "uniform sampler2D u7,u6,u3;uniform float u8,u26,u27,u9;uniform vec2 u28;varying vec2 vv0;const vec2 f=vec2(1.),l=vec2(0.);void main(){vec2 c=floor(u26*vv0),d=u26*vv0-c;float g=u8/u26;vec2 h=floor(d*g),i=d*g-h,j=(c+i)/u26;float m=u26*u9/u8;vec2 b=m*h,n=floor(.5*(u9-1.)*(f-u28));b=floor(u28*b+n);vec2 a=(b+i*u27)/u9;a+=.25/u9;vec2 k=step(a,f)*step(l,a);vec4 o=texture2D(u7,j),p=texture2D(u6,a),q=o*p,r=texture2D(u3,j);gl_FragColor=(q*u27*u27+r)*k.x*k.y;}",
                i: ["u26", "u27", "u3", "u28"].concat(e),
                o: Object.assign({ u3: 2 }, n),
              },
              s30: {
                g: "uniform sampler2D u7,u6;varying vec2 vv0;void main(){vec4 a=texture2D(u7,vv0),b=texture2D(u6,vv0);gl_FragColor=a*b;}",
                i: ["u7", "u6"],
                o: n,
                R: !0,
              },
              s31: {
                g: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;void main(){gl_FragColor=texture2D(u3,vv0)+u4*texture2D(u1,vv0);}",
                i: D,
                o: L,
              },
              s32: {
                g: "uniform sampler2D u1,u3;uniform vec2 u20;uniform float u4;varying vec2 vv0;void main(){gl_FragColor=texture2D(u3,vv0*u20)+u4*texture2D(u1,vv0);}",
                i: ["u20"].concat(D),
                o: L,
                R: !0,
              },
              s33: {
                g: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;const vec4 e=vec4(1.);void main(){vec4 a=texture2D(u3,vv0)+u4*texture2D(u1,vv0);vec2 h=mod(gl_FragCoord.xy,vec2(2.)),d=step(h,vec2(.75));float b=d.x+2.*d.y,c=step(2.5,b),g=(1.-c)*step(1.5,b),i=(1.-c)*(1.-g)*step(.5,b);a=mix(a,a.argb,i*e),a=mix(a,a.barg,g*e),a=mix(a,a.gbar,c*e),gl_FragColor=a;}",
                i: D,
                o: L,
                R: !0,
              },
              s34: {
                g: "uniform sampler2D u1,u3;uniform vec2 u20;uniform float u4;varying vec2 vv0;const vec4 e=vec4(1.);void main(){vec4 a=texture2D(u3,vv0*u20)+u4*texture2D(u1,vv0);vec2 h=mod(gl_FragCoord.xy,vec2(2.)),d=step(h,vec2(.75));float b=d.x+2.*d.y,c=step(2.5,b),g=(1.-c)*step(1.5,b),i=(1.-c)*(1.-g)*step(.5,b);a=mix(a,a.argb,i*e),a=mix(a,a.barg,g*e),a=mix(a,a.gbar,c*e),gl_FragColor=a;}",
                i: ["u20"].concat(D),
                o: L,
                R: !0,
              },
              s35: {
                g: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;const vec4 h=vec4(1.);void main(){vec4 a=texture2D(u3,vv0)+u4*texture2D(u1,vv0);vec2 b=floor(gl_FragCoord.xy);vec3 d=b.x*vec3(1.)+vec3(0.,1.,2.);float c=mod(b.y,2.);vec4 f=vec4(c,(1.-c)*step(mod(d,vec3(3.)),vec3(.5)));mat4 g=mat4(a.rgba,a.gbar,a.barg,a.argb);gl_FragColor=g*f;}",
                i: D,
                o: L,
                R: !0,
              },
              s36: {
                g: "varying vec2 vv0;uniform sampler2D u1;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,g)*f;}",
                i: y,
                o: k,
                precision: "lowp",
              },
              s37: {
                g: "varying vec2 vv0;uniform sampler2D u1;uniform float u29;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u29)).rgb,c=texture2D(u1,vv0+vec2(u29,u29)).rgb,d=texture2D(u1,vv0+vec2(u29,0.)).rgb;gl_FragColor=vec4(dot(a,f),dot(b,f),dot(c,f),dot(d,f));}",
                i: ["u1", "u29"],
                o: k,
                precision: "lowp",
              },
              s38: {
                g: "varying vec2 vv0;uniform sampler2D u1;uniform float u29;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u29)).rgb,c=texture2D(u1,vv0+vec2(u29,u29)).rgb,d=texture2D(u1,vv0+vec2(u29,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}",
                i: ["u1", "u29"],
                o: k,
                precision: "lowp",
              },
              s39: {
                g: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u30;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u30,vv0.y-u30))*1.,a-=texture2D(u1,vec2(vv0.x-u30,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u30,vv0.y+u30))*1.,a+=texture2D(u1,vec2(vv0.x+u30,vv0.y-u30))*1.,a+=texture2D(u1,vec2(vv0.x+u30,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u30,vv0.y+u30))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u30,vv0.y-u30))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u30))*2.,b-=texture2D(u1,vec2(vv0.x+u30,vv0.y-u30))*1.,b+=texture2D(u1,vec2(vv0.x-u30,vv0.y+u30))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u30))*2.,b+=texture2D(u1,vec2(vv0.x+u30,vv0.y+u30))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),g=texture2D(u2,vv0);gl_FragColor=g.a*e.r*f;}",
                i: ["u1", "u2", "u30"],
                o: F,
                R: !0,
              },
              s40: {
                g: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u30;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float h=0.;vec2 l=k*u30,a,b;float c,d,i=0.;for(float e=-4.;e<=4.;e+=1.)for(float f=-4.;f<=4.;f+=1.)a=vec2(e,f),c=length(a)/2.,d=exp(-c*c),b=vv0+l*a,h+=d*texture2D(u1,b).r,i+=d;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,b).r-h/i)*j;}",
                i: ["u1", "u2", "u30"],
                o: F,
                R: !0,
              },
              s41: {
                g: "uniform sampler2D u5;uniform vec2 u14;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 g=vec2(.5,.5),h=vec2(1.,0.),i=vec2(0.,1.);void main(){vec2 a=vv0-u14*g;vec4 b=texture2D(u5,a),c=texture2D(u5,a+u14*h),d=texture2D(u5,a+u14*i),j=texture2D(u5,a+u14),k=e(b,c),l=e(d,j);gl_FragColor=e(k,l);}",
                i: ["u5", "u14"],
                o: G,
              },
              s42: {
                g: "uniform sampler2D u5;uniform vec2 u14;varying vec2 vv0;const vec2 k=vec2(1.,0.),l=vec2(0.,1.),m=vec2(2.,0.),n=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u5,a),c=texture2D(u5,a+u14*k),d=texture2D(u5,a+u14*l),g=texture2D(u5,a+u14),h=e(b,c),i=e(d,g);return e(h,i);}void main(){vec2 a=vv0+u14*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u14*m),d=f(a+u14*2.),g=f(a+u14*n),h=e(b,c),i=e(d,g);gl_FragColor=e(h,i);}",
                i: ["u5", "u14"],
                o: G,
                R: !0,
              },
              s43: {
                g: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
                i: ["u1"],
                o: k,
                precision: "lowp",
                R: !0,
              },
              s44: {
                g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;const float e=15444.;void main(){vec4 a=1001./e*texture2D(u1,vv0-3.*u14)+2002./e*texture2D(u1,vv0-2.*u14)+3003./e*texture2D(u1,vv0-u14)+3432./e*texture2D(u1,vv0)+3003./e*texture2D(u1,vv0+u14)+2002./e*texture2D(u1,vv0+2.*u14)+1001./e*texture2D(u1,vv0+3.*u14);gl_FragColor=a;}",
                i: ["u14", "u1"],
                o: k,
                precision: "lowp",
                R: !0,
              },
              s45: {
                g: "uniform sampler2D u1,u16,u31;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);const float g=.1;void main(){vec4 a=texture2D(u16,vv0),b=texture2D(u31,vv0),c=texture2D(u1,vv0),d=max(f*g,b-a*a),h=sqrt(d);gl_FragColor=(c-a)/h;}",
                i: ["u1", "u16", "u31"],
                o: { u1: 0, u16: 1, u31: 2 },
                R: !0,
              },
            },
            P = {
              s46: {
                g: "uniform float u8,u32;uniform sampler2D u7,u6,u3;varying vec2 vv0;const vec2 ZERO2=vec2(0.),ONE2=vec2(1.),HALF2=vec2(.5),EPS2=vec2(1e-5);void main(){vec4 sum=texture2D(u3,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u8,xyTo=floor(vv0*u8+eps2);float weightSize=toSparsity*u8;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u32*(xyPatch-halfFromSparsity))/u8,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u7,uvWeight)*texture2D(u6,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
                i: ["u8", "u7", "u6", "u3", "u32"],
                Ia: ["1.1111", "gl_FragColor\\*=2.2222;"],
              },
              s47: {
                g: "uniform float u8,u32,u9;uniform sampler2D u7,u6,u3;varying vec2 vv0;const vec2 ZERO2=vec2(0.),ONE2=vec2(1.),HALF2=vec2(.5),EPS2=vec2(1e-4);void main(){vec4 sum=texture2D(u3,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u9,xyTo=floor(vv0*u8+eps2);float weightSize=fromSparsity*u9;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u8;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u32*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u9,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u7,uvWeight)*texture2D(u6,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
                i: "u8 u9 u7 u6 u3 u32".split(" "),
                Ia: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"],
              },
            },
            B = null,
            E = null,
            M = {
              zb: function () {
                return I;
              },
              m: function () {
                if (!I) {
                  B = Ga(z, 2);
                  E = Ga(P, 2);
                  u = "highp";
                  c.getShaderPrecisionFormat &&
                    (c.getShaderPrecisionFormat(
                      c.FRAGMENT_SHADER,
                      c.MEDIUM_FLOAT
                    ),
                    c.getShaderPrecisionFormat(c.FRAGMENT_SHADER, c.LOW_FLOAT));
                  for (var t in B) f(c, B[t], t);
                  aa.set("s0");
                  c.enableVertexAttribArray(0);
                  I = !0;
                }
              },
              uc: function (t) {
                t.forEach(function (v) {
                  M.oa(v);
                });
              },
              oa: function (t) {
                B[t.id] = t;
                f(c, t, t.id);
              },
              Cm: function (t, v, Q) {
                v || (v = t);
                B[v] = Object.create(E[t]);
                B[v].Lm = !0;
                E[t].Ia &&
                  E[t].Ia.forEach(function (X, U) {
                    var ia = "";
                    "gl_Frag" === X.substring(0, 7)
                      ? ((X = new RegExp("[,;]?" + X, "g")), (ia = ";"))
                      : (X = new RegExp(X, "g"));
                    B[v].g = B[v].g.replace(X, ia + Q[U]);
                  });
                f(c, B[v], v);
              },
              set: function (t) {
                var v = B[t];
                v.R && ((v.R = !1), f(c, v, t));
                l(v);
              },
              Eb: function (t) {
                return p(t, w(), "s48");
              },
              he: function (t) {
                return p(
                  t,
                  {
                    g: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                    i: [],
                    precision: u,
                  },
                  "s49"
                );
              },
              Kl: function (t) {
                return "undefined" === typeof B[t] ? !1 : B[t].Oa;
              },
              M: function () {
                -1 !== m &&
                  ((m = -1),
                  q.xa.forEach(function (t) {
                    0 !== t && c.disableVertexAttribArray(t);
                  }));
              },
              je: function () {
                var t = 0;
                q.xa.forEach(function (v, Q) {
                  Q = q.S[Q];
                  c.vertexAttribPointer(v, Q, c.FLOAT, !1, q.ah, t);
                  t += 4 * Q;
                });
              },
              Il: function () {
                c.enableVertexAttribArray(0);
              },
              fc: function () {
                M.hc(c);
              },
              hc: function (t) {
                t.vertexAttribPointer(q.xa[0], 2, t.FLOAT, !1, 8, 0);
              },
              ie: function (t, v) {
                c.uniform1i(q.B[t], v);
              },
              C: function (t, v) {
                c.uniform1f(q.B[t], v);
              },
              O: function (t, v, Q) {
                c.uniform2f(q.B[t], v, Q);
              },
              Bg: function (t, v) {
                c.uniform2fv(q.B[t], v);
              },
              Dg: function (t, v) {
                c.uniform3fv(q.B[t], v);
              },
              Cg: function (t, v, Q, X) {
                c.uniform3f(q.B[t], v, Q, X);
              },
              zo: function (t, v, Q, X, U) {
                c.uniform4f(q.B[t], v, Q, X, U);
              },
              Ba: function (t, v) {
                c.uniform4fv(q.B[t], v);
              },
              Ao: function (t, v) {
                c.uniformMatrix2fv(q.B[t], !1, v);
              },
              Bo: function (t, v) {
                c.uniformMatrix3fv(q.B[t], !1, v);
              },
              Vc: function (t, v) {
                c.uniformMatrix4fv(q.B[t], !1, v);
              },
              j: function (t, v) {
                M.set(t);
                v.forEach(function (Q) {
                  switch (Q.type) {
                    case "4f":
                      c.uniform4fv(q.B[Q.name], Q.value);
                      break;
                    case "3f":
                      c.uniform3fv(q.B[Q.name], Q.value);
                      break;
                    case "2f":
                      c.uniform2fv(q.B[Q.name], Q.value);
                      break;
                    case "1f":
                      c.uniform1f(q.B[Q.name], Q.value);
                      break;
                    case "1i":
                      c.uniform1i(q.B[Q.name], Q.value);
                      break;
                    case "mat2":
                      c.uniformMatrix2fv(q.B[Q.name], !1, Q.value);
                      break;
                    case "mat3":
                      c.uniformMatrix3fv(q.B[Q.name], !1, Q.value);
                      break;
                    case "mat4":
                      c.uniformMatrix4fv(q.B[Q.name], !1, Q.value);
                  }
                });
              },
              $p: function () {
                return "lowp";
              },
              A: function () {
                M.M();
                c.disableVertexAttribArray(0);
                for (var t in B) {
                  var v = B[t];
                  v.Oa && ((v.Oa = !1), c.deleteProgram(v.qa));
                  v.Lm && delete B[t];
                }
                h.forEach(function (Q) {
                  c.deleteShader(Q);
                });
                h.splice(0);
                x = 0;
                I = !1;
                q = null;
                m = -1;
              },
            };
          return M;
        })(),
        c = null,
        mb = (function () {
          function a(y) {
            console.log("ERROR in ContextFF: ", y);
            return !1;
          }
          function b() {
            return (
              navigator.userAgent &&
              -1 !== navigator.userAgent.indexOf("forceWebGL1")
            );
          }
          function d(y, A, k) {
            y.setAttribute("width", A);
            y.setAttribute("height", k);
          }
          function f(y) {
            if (b()) return !1;
            var A = document.createElement("canvas");
            d(A, 5, 5);
            var k = null;
            try {
              k = A.getContext("webgl2", y);
            } catch (g) {
              return !1;
            }
            if (!k) return !1;
            l(k);
            Ia.Mh(k);
            y = Ia.Ze(k);
            if (!y.Wa && !y.Ya) return Hb.A(), Ia.reset(), !1;
            k = Hb.rh(k, y);
            Hb.A();
            Ia.reset();
            return k ? !0 : !1;
          }
          function l(y) {
            y.clearColor(0, 0, 0, 0);
            y.disable(y.DEPTH_TEST);
            y.disable(y.BLEND);
            y.disable(y.DITHER);
            y.disable(y.STENCIL_TEST);
            y.disable(y.CULL_FACE);
            y.GENERATE_MIPMAP_HINT &&
              y.FASTEST &&
              y.hint(y.GENERATE_MIPMAP_HINT, y.FASTEST);
            y.disable(y.SAMPLE_ALPHA_TO_COVERAGE);
            y.disable(y.SAMPLE_COVERAGE);
            y.depthFunc(y.LEQUAL);
            y.clearDepth(1);
          }
          var p = null,
            w = null,
            h = null,
            m = !0,
            q = null,
            x = null,
            I = [],
            u = {
              P: function () {
                return p.width;
              },
              $: function () {
                return p.height;
              },
              tb: function () {
                return p;
              },
              Ql: function () {
                return c;
              },
              na: function () {
                return m;
              },
              flush: function () {
                c.flush();
              },
              iq: function () {
                Ea.reset();
                Ea.ba();
                u.Rn();
              },
              Rn: function () {
                ba.reset();
                Y.reset();
                aa.M();
                aa.Il();
                c.disable(c.DEPTH_TEST);
                c.disable(c.BLEND);
                Y.kd();
                aa.fc();
              },
              Vl: function () {
                q || (q = new Uint8Array(p.width * p.height * 4));
                c.readPixels(
                  0,
                  0,
                  p.width,
                  p.height,
                  c.RGBA,
                  c.UNSIGNED_BYTE,
                  q
                );
                return q;
              },
              Wp: function () {
                return p.toDataURL("image/jpeg");
              },
              Xp: function () {
                Ea.aa();
                w ||
                  ((w = document.createElement("canvas")),
                  (h = w.getContext("2d")));
                d(w, p.width, p.height);
                for (
                  var y = u.Vl(),
                    A = h.createImageData(w.width, w.height),
                    k = w.width,
                    g = w.height,
                    F = A.data,
                    L = 0;
                  L < g;
                  ++L
                )
                  for (var D = g - L - 1, G = 0; G < k; ++G) {
                    var e = 4 * (L * k + G),
                      n = 4 * (D * k + G);
                    F[e] = y[n];
                    F[e + 1] = y[n + 1];
                    F[e + 2] = y[n + 2];
                    F[e + 3] = y[n + 3];
                  }
                h.putImageData(A, 0, 0);
                return w.toDataURL("image/png");
              },
              Zh: function (y) {
                !w &&
                  y &&
                  ((w = document.createElement("canvas")),
                  (h = w.getContext("2d")));
                var A = y ? w : document.createElement("canvas");
                d(A, p.width, p.height);
                (y ? h : A.getContext("2d")).drawImage(p, 0, 0);
                return A;
              },
              m: function (y) {
                y = Object.assign(
                  {
                    Xa: null,
                    dg: null,
                    sa: null,
                    Ue: null,
                    width: 512,
                    height: 512,
                    premultipliedAlpha: !1,
                    Im: !0,
                    antialias: !1,
                    debug: !1,
                    Jp: !1,
                  },
                  y
                );
                y.Xa
                  ? ((c = y.Xa), (p = y.Xa.canvas))
                  : y.Ue && !y.sa
                  ? (p = document.getElementById(y.Ue))
                  : y.sa && (p = y.sa);
                p || (p = document.createElement("canvas"));
                p.width = y.width;
                p.height = y.height;
                if (c) m = c instanceof WebGL2RenderingContext;
                else {
                  m = !0;
                  var A = {
                    antialias: y.antialias,
                    alpha: !0,
                    preserveDrawingBuffer: !0,
                    premultipliedAlpha: y.premultipliedAlpha,
                    stencil: !1,
                    depth: y.Im,
                    failIfMajorPerformanceCaveat: !0,
                    powerPreference: "high-performance",
                  };
                  navigator &&
                    navigator.userAgent &&
                    -1 !== navigator.userAgent.indexOf("noAntialiasing") &&
                    (A.antialias = !1);
                  var k = f(A);
                  k || !A.antialias || b() || ((A.antialias = !1), (k = f(A)));
                  k && (c = p.getContext("webgl2", A));
                  c
                    ? (m = !0)
                    : ((c = p.getContext("webgl", A)) ||
                        (c = p.getContext("experimental-webgl", A)),
                      (m = !1));
                }
                if (!c) return a("WebGL1 and 2 are not enabled");
                y.dg &&
                  p.addEventListener &&
                  ((x = y.dg), p.addEventListener("webglcontextlost", x, !1));
                if (!Ia.m()) return a("Not enough GL capabilities");
                l(c);
                aa.m();
                Y.m();
                Hb.rh(c, Ia.Sl());
                I.forEach(function (g) {
                  g(c);
                });
                I.splice(0);
                return !0;
              },
              zp: function () {
                return new Promise(function (y) {
                  c ? y(c) : I.push(y);
                });
              },
              A: function () {
                c && (Ia.A(), aa.A(), Hb.A());
                x &&
                  (p.removeEventListener("webglcontextlost", x, !1),
                  (x = null));
                c = q = h = w = p = null;
                I.splice(0);
              },
            };
          return u;
        })(),
        Cb = (function () {
          function a() {
            null === b &&
              ("undefined" !== typeof aa
                ? (b = aa)
                : "undefined" !== typeof C && (b = C));
          }
          var b = null;
          return {
            reset: function () {
              b = null;
            },
            Cj: function (d) {
              b !== d && (b && b.M(), (b = d));
            },
            zb: function () {
              return b.zb();
            },
            fc: function () {
              return b.fc();
            },
            hc: function (d) {
              return b.hc(d);
            },
            je: function () {
              return b.je();
            },
            M: function () {
              return b.M();
            },
            set: function (d) {
              a();
              return b.set(d);
            },
            Eb: function (d) {
              a();
              return b.Eb(d);
            },
            he: function (d) {
              a();
              return b.he(d);
            },
          };
        })(),
        ba = (function () {
          function a(E) {
            c.bindTexture(c.TEXTURE_2D, E);
          }
          function b(E) {
            var M = new Uint16Array(E.length);
            E.forEach(function (t, v) {
              n[0] = t;
              var Q = z[0];
              var X = (Q >> 16) & 32768;
              t = (Q >> 12) & 2047;
              var U = (Q >> 23) & 255;
              Q =
                103 > U
                  ? X
                  : 142 < U
                  ? X | 31744 | ((255 == U ? 0 : 1) && Q & 8388607)
                  : 113 > U
                  ? ((t |= 2048),
                    X | ((t >> (114 - U)) + ((t >> (113 - U)) & 1)))
                  : (X | ((U - 112) << 10) | (t >> 1)) + (t & 1);
              M[v] = Q;
            });
            return M;
          }
          function d() {
            if (null !== P.Af) return P.Af;
            var E = f(b([0.5, 0.5, 0.5, 0.5]), !0);
            return null === E ? !0 : (P.Af = E);
          }
          function f(E, M) {
            if (!Cb.zb() || !y) return null;
            var t = null,
              v = Math.sqrt(E.length / 4);
            try {
              var Q = c.getError();
              if ("FUCKING_BIG_ERROR" === Q) return !1;
              t = B.instance({ isFloat: !1, U: M, array: E, width: v });
              Q = c.getError();
              if (Q !== c.NO_ERROR) return !1;
            } catch (X) {
              return !1;
            }
            Ea.aa();
            c.viewport(0, 0, v, v);
            c.clearColor(0, 0, 0, 0);
            c.clear(c.COLOR_BUFFER_BIT);
            Cb.set("s0");
            t.ya(0);
            Y.l(!0, !0);
            E = 4 * v * v;
            M = new Uint8Array(E);
            c.readPixels(0, 0, v, v, c.RGBA, c.UNSIGNED_BYTE, M);
            v = !0;
            for (Q = 0; Q < E; ++Q) v = v && 3 > Math.abs(M[Q] - 127);
            t.remove();
            Ea.ba();
            return v;
          }
          var l = 0,
            p = null,
            w = 0,
            h = null,
            m = null,
            q = null,
            x = null,
            I = null,
            u = null,
            y = !1,
            A = [],
            k = {
              isFloat: !1,
              isPot: !0,
              isLinear: !1,
              isMipmap: !1,
              xi: !1,
              isAnisotropicFiltering: !1,
              isMirrorX: !1,
              isMirrorY: !1,
              isSrgb: !1,
              isKeepArray: !1,
              isFlipY: null,
              width: 0,
              height: 0,
              url: null,
              array: null,
              data: null,
              la: null,
              ji: null,
              Km: !1,
              U: !1,
              D: null,
              L: 4,
              Vf: 0,
            },
            g = !1,
            F = null,
            L = null,
            D = [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            G = !1,
            e = !1,
            n = new Float32Array(1),
            z = new Int32Array(n.buffer),
            P = { Af: null, Bf: null },
            B = {
              m: function () {
                y ||
                  ((I = [c.RGBA, null, c.RGBA, c.RGBA]),
                  (u = [c.RGBA, null, c.RGBA, c.RGBA]),
                  (p = [
                    c.TEXTURE0,
                    c.TEXTURE1,
                    c.TEXTURE2,
                    c.TEXTURE3,
                    c.TEXTURE4,
                    c.TEXTURE5,
                    c.TEXTURE6,
                    c.TEXTURE7,
                  ]),
                  (G = "undefined" !== typeof ha),
                  (e = "undefined" !== typeof Ia),
                  (h = [-1, -1, -1, -1, -1, -1, -1, -1]),
                  (x = [c.UNSIGNED_BYTE, c.FLOAT, c.FLOAT]),
                  (y = !0));
              },
              po: function () {
                c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.LINEAR);
                c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.LINEAR);
              },
              so: function () {
                c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
                c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
              },
              Am: function () {
                if (!m) {
                  for (var E = new Float32Array(16384), M = 0; 16384 > M; ++M)
                    E[M] = 2 * Math.random() - 1;
                  m = {
                    random: B.instance({
                      isFloat: !0,
                      isPot: !0,
                      array: E,
                      width: 64,
                    }),
                    Sj: B.instance({
                      isFloat: !1,
                      isPot: !0,
                      width: 1,
                      array: new Uint8Array([0, 0, 0, 0]),
                    }),
                  };
                }
                B.Vo();
              },
              xj: function (E) {
                c.framebufferTexture2D(
                  Ea.qf(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  E,
                  0
                );
              },
              ii: function () {
                return m.Sj;
              },
              Vo: function () {
                x[1] = Ia.pf(c);
              },
              uo: function () {
                u = I = [c.RGBA, c.RGBA, c.RGBA, c.RGBA];
              },
              fj: function (E) {
                aa.set("s1");
                Ea.aa();
                var M = E.P(),
                  t = E.$();
                c.viewport(0, 0, M, t);
                E.h(0);
                Y.l(!1, !1);
              },
              Aq: function (E, M) {
                B.fj(E);
                c.readPixels(0, 0, E.P(), E.$(), c.RGBA, c.UNSIGNED_BYTE, M);
              },
              Bq: function (E, M) {
                B.fj(E);
                return Ia.og(0, 0, E.P(), E.$(), M);
              },
              Th: function (E, M, t, v, Q, X, U) {
                E.activeTexture(E.TEXTURE0);
                var ia = E.createTexture();
                E.bindTexture(E.TEXTURE_2D, ia);
                Q = Q instanceof Float32Array ? Q : new Float32Array(Q);
                E.texParameteri(
                  E.TEXTURE_2D,
                  E.TEXTURE_WRAP_S,
                  E.CLAMP_TO_EDGE
                );
                E.texParameteri(
                  E.TEXTURE_2D,
                  E.TEXTURE_WRAP_T,
                  E.CLAMP_TO_EDGE
                );
                E.texParameteri(E.TEXTURE_2D, E.TEXTURE_MAG_FILTER, E.NEAREST);
                E.texParameteri(E.TEXTURE_2D, E.TEXTURE_MIN_FILTER, E.NEAREST);
                E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL, X);
                E.texImage2D(
                  E.TEXTURE_2D,
                  0,
                  E.RGBA,
                  t,
                  v,
                  0,
                  E.RGBA,
                  E.FLOAT,
                  Q
                );
                E.bindTexture(E.TEXTURE_2D, null);
                E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL, !1);
                U && (Ea.ba(), aa.Eb(E));
                E.viewport(0, 0, t, v);
                E.framebufferTexture2D(
                  E.FRAMEBUFFER,
                  E.COLOR_ATTACHMENT0,
                  E.TEXTURE_2D,
                  M,
                  0
                );
                E.bindTexture(E.TEXTURE_2D, ia);
                U ? Y.l(!0, !0) : Y.Qb(E);
                E.deleteTexture(ia);
                y && ((h[0] = -1), (q = null), (l = 0));
              },
              Fe: function (E) {
                E !== l && (c.activeTexture(p[E]), (l = E));
              },
              instance: function (E) {
                function M() {
                  qa =
                    void 0 !== O.la.videoWidth ? O.la.videoWidth : O.la.width;
                  oa =
                    void 0 !== O.la.videoHeight
                      ? O.la.videoHeight
                      : O.la.height;
                }
                function t(ea) {
                  var Aa = c.getError();
                  if ("FUCKING_BIG_ERROR" === Aa) return !1;
                  c.texImage2D(c.TEXTURE_2D, 0, Va, Ma, ra, ea);
                  Aa = c.getError();
                  Aa !== c.NO_ERROR &&
                    Ma !== c.RGBA &&
                    ((Ma = c.RGBA),
                    c.texImage2D(c.TEXTURE_2D, 0, Va, Ma, ra, ea));
                  return !0;
                }
                function v() {
                  if (!T) {
                    a(fa);
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, xa);
                    O.isPot
                      ? (c.texParameteri(
                          c.TEXTURE_2D,
                          c.TEXTURE_WRAP_S,
                          O.isMirrorX ? c.MIRRORED_REPEAT : c.REPEAT
                        ),
                        c.texParameteri(
                          c.TEXTURE_2D,
                          c.TEXTURE_WRAP_T,
                          O.isMirrorY ? c.MIRRORED_REPEAT : c.REPEAT
                        ))
                      : (c.texParameteri(
                          c.TEXTURE_2D,
                          c.TEXTURE_WRAP_S,
                          c.CLAMP_TO_EDGE
                        ),
                        c.texParameteri(
                          c.TEXTURE_2D,
                          c.TEXTURE_WRAP_T,
                          c.CLAMP_TO_EDGE
                        ));
                    O.isAnisotropicFiltering &&
                      "undefined" !== typeof W &&
                      c.texParameterf(
                        c.TEXTURE_2D,
                        ha.Wl().TEXTURE_MAX_ANISOTROPY_EXT,
                        W.sk
                      );
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MAG_FILTER,
                      O.isLinear ? c.LINEAR : c.NEAREST
                    );
                    var ea = O.isMipmap && !ub;
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MIN_FILTER,
                      O.xi
                        ? c.LINEAR_MIPMAP_LINEAR
                        : O.isLinear
                        ? ea
                          ? c.NEAREST_MIPMAP_LINEAR
                          : c.LINEAR
                        : ea
                        ? c.NEAREST_MIPMAP_NEAREST
                        : c.NEAREST
                    );
                    Ma = I[O.L - 1];
                    Va = u[O.L - 1];
                    ra = x[Qa];
                    Ia.na() &&
                      ((ea = Ia.Yl()),
                      Ma === c.RGBA && ra === c.FLOAT
                        ? O.isMipmap || O.isLinear
                          ? (Va = Hb.$l(c))
                          : Ia.ja()
                          ? ea && (Va = ea)
                          : (Va = c.RGBA16F || c.RGBA)
                        : Ma === c.RGB &&
                          ra === c.FLOAT &&
                          ea &&
                          ((Va = ea), (Ma = c.RGBA)));
                    if (
                      (O.U && !O.isFloat) ||
                      (O.isFloat && O.isMipmap && Hb.Tm())
                    )
                      (Va = Ia.Zl()), (ra = Ia.pf(c));
                    O.Vf && (lb = O.Vf);
                    O.isSrgb && 4 === O.L && (Ma = ha.sm());
                    if (O.la) t(O.la);
                    else if (O.url) t(ma);
                    else if (ya) {
                      ea = ya;
                      try {
                        "BIG_ERROR" !== c.getError() &&
                          (c.texImage2D(
                            c.TEXTURE_2D,
                            0,
                            Va,
                            qa,
                            oa,
                            0,
                            Ma,
                            ra,
                            ea
                          ),
                          c.getError() !== c.NO_ERROR &&
                            (c.texImage2D(
                              c.TEXTURE_2D,
                              0,
                              Va,
                              qa,
                              oa,
                              0,
                              Ma,
                              ra,
                              null
                            ),
                            c.getError() !== c.NO_ERROR &&
                              c.texImage2D(
                                c.TEXTURE_2D,
                                0,
                                c.RGBA,
                                qa,
                                oa,
                                0,
                                c.RGBA,
                                c.UNSIGNED_BYTE,
                                null
                              )));
                      } catch (Ub) {
                        c.texImage2D(
                          c.TEXTURE_2D,
                          0,
                          Va,
                          qa,
                          oa,
                          0,
                          Ma,
                          ra,
                          null
                        );
                      }
                      O.isKeepArray || (ya = null);
                    } else
                      (ea = c.getError()),
                        "BIG_ERROR" !== ea &&
                          (c.texImage2D(
                            c.TEXTURE_2D,
                            0,
                            Va,
                            qa,
                            oa,
                            0,
                            Ma,
                            ra,
                            null
                          ),
                          (ea = c.getError()),
                          ea !== c.NO_ERROR &&
                            ((Ma = c.RGBA),
                            O.U &&
                              ra !== c.FLOAT &&
                              ((ra = c.FLOAT),
                              c.texImage2D(
                                c.TEXTURE_2D,
                                0,
                                Va,
                                qa,
                                oa,
                                0,
                                Ma,
                                ra,
                                null
                              ))));
                    if (O.isMipmap)
                      if (!ub && Ya) Ya.Ec(), (Xb = !0);
                      else if (ub) {
                        ea = Math.log2(Math.min(qa, oa));
                        Xa = Array(1 + ea);
                        Xa[0] = fa;
                        for (var Aa = 1; Aa <= ea; ++Aa) {
                          var hb = Math.pow(2, Aa),
                            Na = qa / hb;
                          hb = oa / hb;
                          var tb = c.createTexture();
                          a(tb);
                          c.texParameteri(
                            c.TEXTURE_2D,
                            c.TEXTURE_MIN_FILTER,
                            c.NEAREST
                          );
                          c.texParameteri(
                            c.TEXTURE_2D,
                            c.TEXTURE_MAG_FILTER,
                            c.NEAREST
                          );
                          c.texImage2D(
                            c.TEXTURE_2D,
                            0,
                            Va,
                            Na,
                            hb,
                            0,
                            Ma,
                            ra,
                            null
                          );
                          a(null);
                          Xa[Aa] = tb;
                        }
                        Xb = !0;
                      }
                    a(null);
                    h[l] = -1;
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
                    la = !0;
                    O.D && Ya && (O.D(Ya), (O.D = null));
                  }
                }
                function Q() {
                  for (
                    var ea = qa * oa, Aa = 2 * ea, hb = 3 * ea, Na = 0;
                    Na < ea;
                    ++Na
                  )
                    (Ha[0][Na] = Ta[Na]),
                      (Ha[1][Na] = Ta[Na + ea]),
                      (Ha[2][Na] = Ta[Na + Aa]),
                      (Ha[3][Na] = Ta[Na + hb]);
                }
                function X() {
                  var ea = qa * oa * 4;
                  bb = [
                    new Uint8Array(ea),
                    new Uint8Array(ea),
                    new Uint8Array(ea),
                    new Uint8Array(ea),
                  ];
                  Ha = [
                    new Float32Array(bb[0].buffer),
                    new Float32Array(bb[1].buffer),
                    new Float32Array(bb[2].buffer),
                    new Float32Array(bb[3].buffer),
                  ];
                  Da = new Uint8Array(4 * ea);
                  Ta = new Float32Array(Da.buffer);
                  ta = !0;
                }
                function U() {
                  ia = new Uint8Array(qa * oa * 4);
                  rc = new Float32Array(ia.buffer);
                  cc = !0;
                }
                var ia,
                  O = Object.assign({}, k, E),
                  ka = w++;
                null === O.isFlipY && (O.isFlipY = O.url ? !0 : !1);
                O.data &&
                  ((O.array =
                    "string" === typeof O.data
                      ? Pb(O.data)
                      : O.isFloat
                      ? new Float32Array(O.data)
                      : new Uint8Array(O.data)),
                  (O.isFlipY = !1));
                var Qa = 0,
                  H = O.la ? !0 : !1,
                  r = null,
                  N = null,
                  ca = !1;
                O.U = O.U || O.isFloat;
                O.U && (Qa = 1);
                !O.Km && O.isFloat && e && !Ia.ja() && (O.isFloat = !1);
                O.isFloat && (Qa = 2);
                O.isAnisotropicFiltering &&
                  G &&
                  !ha.Rm() &&
                  (O.isAnisotropicFiltering = !1);
                var fa = O.ji || c.createTexture(),
                  ma = null,
                  ya = !1,
                  qa = 0,
                  oa = 0,
                  la = !1,
                  T = !1,
                  ta = !1,
                  Ha = null,
                  bb = null,
                  Da = null,
                  Ta = null,
                  Va = null,
                  Ma = null,
                  ra = null,
                  xa = O.isFlipY,
                  Ab = (E = O.U && O.isMipmap) && Hb.$k(),
                  ub = E && !Ab ? !0 : !1,
                  Xa = null,
                  lb = -1,
                  qc = -1,
                  Xb = !1,
                  cc = !1,
                  rc = (ia = null);
                O.width && ((qa = O.width), (oa = O.height ? O.height : qa));
                var Ya = {
                  get: function () {
                    return fa;
                  },
                  P: function () {
                    return qa;
                  },
                  $: function () {
                    return oa;
                  },
                  tm: function () {
                    return O.url;
                  },
                  Sm: function () {
                    return O.isFloat;
                  },
                  oq: function () {
                    return O.U;
                  },
                  Nq: function (ea) {
                    fa = ea;
                  },
                  qq: function () {
                    return O.isLinear;
                  },
                  Ec: function () {
                    c.generateMipmap(c.TEXTURE_2D);
                  },
                  Sk: function (ea, Aa) {
                    ub
                      ? (ea || (ea = Ya.fi()),
                        B.Fe(Aa),
                        a(Xa[ea]),
                        (h[Aa] = -1))
                      : Ya.h(Aa);
                  },
                  fi: function () {
                    -1 === lb && (lb = Math.log2(qa));
                    return lb;
                  },
                  zj: function (ea) {
                    c.TEXTURE_MAX_LEVEL &&
                      c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAX_LEVEL, ea);
                  },
                  Pl: function (ea) {
                    ea || (ea = Ya.fi());
                    if (ub) {
                      aa.set("s12");
                      B.Fe(0);
                      for (var Aa = qa, hb = oa, Na = 1; Na <= ea; ++Na)
                        (Aa /= 2),
                          (hb /= 2),
                          aa.O("u14", 0.25 / Aa, 0.25 / hb),
                          c.viewport(0, 0, Aa, hb),
                          a(Xa[Na - 1]),
                          c.framebufferTexture2D(
                            Ea.qf(),
                            c.COLOR_ATTACHMENT0,
                            c.TEXTURE_2D,
                            Xa[Na],
                            0
                          ),
                          Y.l(!1, 1 === Na);
                      h[0] = -1;
                    } else ea !== qc && ((qc = ea), Ya.zj(ea)), Ya.Ec();
                  },
                  Oq: function (ea) {
                    (H = !(
                      Array.isArray(ea) ||
                      ea.constructor === Float32Array ||
                      ea.constructor === Uint8Array
                    ))
                      ? ((ya = null), (O.la = ea), M())
                      : (ya = ea);
                  },
                  h: function (ea) {
                    if (!la) return !1;
                    B.Fe(ea);
                    if (h[ea] === ka) return !1;
                    a(fa);
                    h[ea] = ka;
                    return !0;
                  },
                  ya: function (ea) {
                    c.activeTexture(p[ea]);
                    l = ea;
                    a(fa);
                    h[ea] = ka;
                  },
                  u: function () {
                    q = Ya;
                    B.xj(fa);
                  },
                  J: function () {
                    c.viewport(0, 0, qa, oa);
                    q = Ya;
                    B.xj(fa);
                  },
                  se: B.se,
                  mo: function (ea, Aa) {
                    qa = ea;
                    oa = Aa;
                  },
                  resize: function (ea, Aa) {
                    Ya.mo(ea, Aa);
                    v();
                  },
                  clone: function (ea) {
                    ea = B.instance({
                      width: qa,
                      height: oa,
                      U: O.U,
                      isFloat: O.isFloat,
                      isLinear: O.isLinear,
                      isMirrorY: O.isMirrorY,
                      isFlipY: ea ? !xa : xa,
                      isPot: O.isPot,
                    });
                    Cb.set("s0");
                    Ea.ba();
                    ea.J();
                    Ya.h(0);
                    Y.l(!0, !0);
                    return ea;
                  },
                  Wc: function () {
                    c.viewport(0, 0, qa, oa);
                  },
                  remove: function () {
                    c.deleteTexture(fa);
                    T = !0;
                    A.splice(A.indexOf(Ya), 1);
                    Ya = null;
                  },
                  refresh: function () {
                    Ya.ya(0);
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
                    H
                      ? c.texImage2D(c.TEXTURE_2D, 0, Va, Ma, ra, O.la)
                      : c.texImage2D(
                          c.TEXTURE_2D,
                          0,
                          Va,
                          qa,
                          oa,
                          0,
                          Ma,
                          ra,
                          ya
                        );
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
                  },
                  dj: function () {
                    ta || X();
                    c.readPixels(0, 0, qa, 4 * oa, c.RGBA, c.UNSIGNED_BYTE, Da);
                    Q();
                    return Ha;
                  },
                  Hn: function () {
                    ta || X();
                    return Ia.og(0, 0, qa, 4 * oa, Da).then(function () {
                      Q();
                      return Ha;
                    });
                  },
                  Jn: function () {
                    cc || U();
                    c.readPixels(0, 0, qa, oa, c.RGBA, c.UNSIGNED_BYTE, ia);
                    return rc;
                  },
                  In: function () {
                    cc || U();
                    return Ia.og(0, 0, qa, oa, ia);
                  },
                  Fh: function (ea) {
                    Ea.aa();
                    aa.set("s15");
                    Ya.h(0);
                    if (ea)
                      c.viewport(0, 0, qa, oa),
                        aa.zo("u15", 0.25, 0.25, 0.25, 0.25),
                        Y.l(!1, !0);
                    else
                      for (ea = 0; 4 > ea; ++ea)
                        c.viewport(0, oa * ea, qa, oa),
                          aa.Ba("u15", D[ea]),
                          Y.l(!1, 0 === ea);
                  },
                  Wg: function (ea) {
                    var Aa;
                    if ((Aa = ra === x[0]))
                      null !== P.Bf
                        ? (Aa = P.Bf)
                        : ((Aa = f(new Uint8Array([127, 127, 127, 127]), !1)),
                          (Aa = null === Aa ? !0 : (P.Bf = Aa))),
                        (Aa = !Aa);
                    a(fa);
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
                    Aa
                      ? (ca ||
                          ((r = document.createElement("canvas")),
                          (r.width = qa),
                          (r.height = oa),
                          (N = r.getContext("2d")),
                          N.createImageData(qa, oa),
                          (ca = !0)),
                        null.data.set(ea),
                        N.putImageData(null, 0, 0),
                        c.texImage2D(c.TEXTURE_2D, 0, Va, Ma, ra, r))
                      : c.texImage2D(
                          c.TEXTURE_2D,
                          0,
                          Va,
                          qa,
                          oa,
                          0,
                          Ma,
                          ra,
                          ea
                        );
                    h[l] = ka;
                    xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
                  },
                  br: function (ea, Aa) {
                    a(fa);
                    Aa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
                    c.texImage2D(c.TEXTURE_2D, 0, Va, Ma, ra, ea);
                    h[l] = ka;
                    Aa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
                  },
                  cc: function (ea, Aa) {
                    var hb = qa * oa,
                      Na = 4 * hb;
                    ea = O.U ? (ea ? "RGBE" : "JSON") : "RGBA";
                    Aa && (ea = Aa);
                    Aa = Ia.na() && !1;
                    var tb = null;
                    switch (ea) {
                      case "RGBE":
                        tb = "s13";
                        break;
                      case "JSON":
                        tb = Aa ? "s0" : "s15";
                        break;
                      case "RGBA":
                      case "RGBAARRAY":
                        tb = "s7";
                    }
                    ta ||
                      ("RGBA" === ea || "RGBE" === ea || "RGBAARRAY" === ea
                        ? ((bb = new Uint8Array(Na)), (ta = !0))
                        : "JSON" !== ea || Aa || X());
                    Ea.aa();
                    aa.set(tb);
                    Ya.h(0);
                    Na = null;
                    if ("RGBA" === ea || "RGBE" === ea || "RGBAARRAY" === ea) {
                      c.viewport(0, 0, qa, oa);
                      Y.l(!0, !0);
                      c.readPixels(0, 0, qa, oa, c.RGBA, c.UNSIGNED_BYTE, bb);
                      if ("RGBAARRAY" === ea) return { data: bb };
                      g ||
                        ((F = document.createElement("canvas")),
                        (L = F.getContext("2d")),
                        (g = !0));
                      F.width = qa;
                      F.height = oa;
                      hb = L.createImageData(qa, oa);
                      hb.data.set(bb);
                      L.putImageData(hb, 0, 0);
                      Na = F.toDataURL("image/png");
                    } else if ("JSON" === ea)
                      if (Aa)
                        (Na = new Float32Array(hb)),
                          c.viewport(0, 0, qa, oa),
                          Y.l(!0, !0),
                          c.readPixels(0, 0, qa, oa, c.RGBA, c.FLOAT, Na);
                      else {
                        for (Na = 0; 4 > Na; ++Na)
                          c.viewport(0, oa * Na, qa, oa),
                            aa.Ba("u15", D[Na]),
                            Y.l(!Na, !Na);
                        Ya.dj();
                        Na = Array(hb);
                        for (Aa = 0; Aa < hb; ++Aa)
                          (Na[4 * Aa] = Ha[0][Aa]),
                            (Na[4 * Aa + 1] = Ha[1][Aa]),
                            (Na[4 * Aa + 2] = Ha[2][Aa]),
                            (Na[4 * Aa + 3] = Ha[3][Aa]);
                      }
                    return {
                      format: ea,
                      data: Na,
                      width: qa,
                      height: oa,
                      isMirrorY: O.isMirrorY,
                      isFlipY: "RGBA" === ea ? O.isFlipY : !O.isFlipY,
                    };
                  },
                };
                O.isMipmap && !ub && la && !Xb && (Ya.Ec(), (Xb = !0));
                if (O.url)
                  a(fa),
                    c.texImage2D(
                      c.TEXTURE_2D,
                      0,
                      c.RGBA,
                      1,
                      1,
                      0,
                      c.RGBA,
                      c.UNSIGNED_BYTE,
                      null
                    ),
                    (ma = new Image()),
                    (ma.crossOrigin = "anonymous"),
                    (ma.src = O.url),
                    (ma.onload = function () {
                      qa = ma.width;
                      oa = ma.height;
                      v();
                    });
                else if (O.la) {
                  var sc = function () {
                    M();
                    qa ? v() : setTimeout(sc, 1);
                  };
                  sc();
                } else
                  O.array
                    ? (O.U && !O.isFloat
                        ? O.array instanceof Uint16Array
                          ? ((ya = O.array), v())
                          : d()
                          ? ((ya = b(O.array)), v())
                          : (v(), B.Th(c, fa, Ya.P(), Ya.$(), O.array, xa, !0))
                        : ((ya = O.isFloat
                            ? O.array instanceof Float32Array
                              ? O.array
                              : new Float32Array(O.array)
                            : O.array instanceof Uint8Array
                            ? O.array
                            : new Uint8Array(O.array)),
                          v()),
                      O.isKeepArray ||
                        (ya && ya !== O.array && (ya = null), delete O.array))
                    : O.ji
                    ? (la = !0)
                    : v();
                Ya.eq = Ya.P;
                O.D && la && (O.D(Ya), (O.D = null));
                A.push(Ya);
                return Ya;
              },
              aa: function (E) {
                E !== l && (c.activeTexture(p[E]), (l = E));
                h[E] = -1;
                a(null);
              },
              Uk: function (E) {
                m.random.h(E);
              },
              se: function () {
                q = null;
                c.framebufferTexture2D(
                  Ea.qf(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  null,
                  0
                );
              },
              reset: function () {
                0 !== l && c.activeTexture(p[0]);
                for (var E = 0; E < p.length; ++E) h[E] = -1;
                l = -1;
              },
              Eq: function () {
                l = -1;
              },
              Uj: function () {
                for (var E = 0; E < p.length; ++E) B.aa(E);
              },
              I: function () {
                m && (m.random.remove(), m.Sj.remove());
              },
              Zc: function (E, M) {
                if ("RGBA" === E.format || "RGBE" === E.format) {
                  var t = new Image();
                  t.src = E.data;
                  t.onload = function () {
                    B.instance({
                      isMirrorY: E.isMirrorY,
                      isFlipY: E.isFlipY,
                      isFloat: !1,
                      la: t,
                      D: function (v) {
                        if ("RGBA" === E.format) M(v);
                        else {
                          var Q = E.width,
                            X = E.height,
                            U = B.instance({
                              isMirrorY: E.isMirrorY,
                              isFloat: !0,
                              width: Q,
                              height: X,
                              isFlipY: E.isFlipY,
                            });
                          Ea.ba();
                          c.viewport(0, 0, Q, X);
                          aa.set("s14");
                          U.u();
                          v.h(0);
                          Y.l(!0, !0);
                          B.aa(0);
                          M(U);
                          Ia.flush();
                          v.remove();
                        }
                      },
                    });
                  };
                } else
                  "JSON" === E.format
                    ? M(
                        B.instance({
                          isFloat: !0,
                          isFlipY: E.isFlipY,
                          width: E.width,
                          height: E.height,
                          array: new Float32Array(E.data),
                        })
                      )
                    : M(!1);
              },
              fl: b,
              A: function () {
                q && (Ea.ba(), B.se(), Ea.aa());
                B.Uj();
                A.slice(0).forEach(function (E) {
                  E.remove();
                });
                A.splice(0);
                y = !1;
                w = 0;
                "undefined" !== typeof Hb && Hb.A();
                m = null;
              },
            };
          return B;
        })(),
        Mc = {
          instance: function (a) {
            var b = [ba.instance(a), ba.instance(a)],
              d = [b[1], b[0]],
              f = d,
              l = {
                sj: function (p) {
                  f[1].u();
                  f[0].h(p);
                  l.Gj();
                },
                tj: function (p) {
                  f[1].J();
                  f[0].h(p);
                  l.Gj();
                },
                Gj: function () {
                  f = f === b ? d : b;
                },
                refresh: function () {
                  f[0].refresh();
                  f[1].refresh();
                },
                h: function (p) {
                  f[0].h(p);
                },
                ya: function (p) {
                  f[0].ya(p);
                },
                Tk: function (p) {
                  f[1].h(p);
                },
                bi: function () {
                  return f[0];
                },
                bq: function () {
                  return f[1];
                },
                Wg: function (p) {
                  f[0].Wg(p);
                  f[1].Wg(p);
                },
                remove: function () {
                  f[0].remove();
                  f[1].remove();
                  f = null;
                },
                sync: function () {
                  l.tj(0);
                  aa.set("s0");
                  Y.l(!1, !1);
                },
              };
            return l;
          },
        },
        Y = (function () {
          function a(m) {
            var q = { ka: null, indices: null };
            q.ka = m.createBuffer();
            m.bindBuffer(m.ARRAY_BUFFER, q.ka);
            m.bufferData(
              m.ARRAY_BUFFER,
              new Float32Array([-1, -1, 3, -1, -1, 3]),
              m.STATIC_DRAW
            );
            q.indices = m.createBuffer();
            m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, q.indices);
            m.bufferData(
              m.ELEMENT_ARRAY_BUFFER,
              new Uint16Array([0, 1, 2]),
              m.STATIC_DRAW
            );
            return q;
          }
          var b = null,
            d = 0,
            f = !1,
            l = [],
            p = -2,
            w = -2,
            h = {
              reset: function () {
                w = p = -2;
              },
              m: function () {
                f || ((b = a(c)), h.kd(), (f = !0));
              },
              instance: function (m) {
                var q = d++,
                  x = m.indices ? m.indices.length : 0,
                  I = "undefined" === typeof m.mode ? c.STATIC_DRAW : m.mode,
                  u = c.createBuffer();
                c.bindBuffer(c.ARRAY_BUFFER, u);
                c.bufferData(
                  c.ARRAY_BUFFER,
                  m.ka instanceof Float32Array ? m.ka : new Float32Array(m.ka),
                  I
                );
                p = q;
                var y = null,
                  A = null,
                  k = null;
                if (m.indices) {
                  y = c.createBuffer();
                  c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, y);
                  var g = null;
                  65536 > m.indices.length
                    ? ((g = Uint16Array), (A = c.UNSIGNED_SHORT), (k = 2))
                    : ((g = Uint32Array), (A = c.UNSIGNED_INT), (k = 4));
                  g = m.indices instanceof g ? m.indices : new g(m.indices);
                  c.bufferData(c.ELEMENT_ARRAY_BUFFER, g, I);
                  w = q;
                }
                var F = {
                  yc: function (L) {
                    p !== q && (c.bindBuffer(c.ARRAY_BUFFER, u), (p = q));
                    L && Cb.je();
                  },
                  Qk: function () {
                    w !== q &&
                      (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, y), (w = q));
                  },
                  bind: function (L) {
                    F.yc(L);
                    F.Qk();
                  },
                  W: function () {
                    c.drawElements(c.TRIANGLES, x, A, 0);
                  },
                  Na: function (L, D) {
                    c.drawElements(c.TRIANGLES, L, A, D * k);
                  },
                  remove: function () {
                    c.deleteBuffer(u);
                    m.indices && c.deleteBuffer(y);
                    F = null;
                  },
                };
                l.push(F);
                return F;
              },
              kd: function () {
                -1 !== p && (c.bindBuffer(c.ARRAY_BUFFER, b.ka), (p = -1));
                -1 !== w &&
                  (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b.indices), (w = -1));
              },
              l: function (m, q) {
                m && Y.kd();
                q && Cb.fc();
                c.drawElements(c.TRIANGLES, 3, c.UNSIGNED_SHORT, 0);
              },
              Qb: function (m) {
                m = m || c;
                var q = a(m);
                m.bindBuffer(m.ARRAY_BUFFER, q.ka);
                m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, q.indices);
                Cb.hc(m);
                m.clear(m.COLOR_BUFFER_BIT);
                m.drawElements(m.TRIANGLES, 3, m.UNSIGNED_SHORT, 0);
                m.flush();
                m.bindBuffer(m.ARRAY_BUFFER, null);
                m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, null);
                m.deleteBuffer(q.ka);
                m.deleteBuffer(q.indices);
                h.reset();
                f && (h.kd(), Cb.fc());
              },
              I: function () {
                var m = c,
                  q = b;
                m.deleteBuffer(q.ka);
                m.deleteBuffer(q.indices);
              },
              A: function () {
                h.I();
                l.forEach(function (m) {
                  m.remove();
                });
                c.bindBuffer(c.ARRAY_BUFFER, null);
                c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, null);
                h.reset();
                f = !1;
                l.splice(0);
                d = 0;
              },
            };
          return h;
        })(),
        Ea = (function () {
          var a = null,
            b = null,
            d = null,
            f = !1,
            l = [],
            p = { ma: -2, Sh: 1 },
            w = {
              zb: function () {
                return f;
              },
              m: function () {
                if (!f) {
                  a = c.createFramebuffer();
                  var h = Ia.na();
                  b =
                    h && c.DRAW_FRAMEBUFFER
                      ? c.DRAW_FRAMEBUFFER
                      : c.FRAMEBUFFER;
                  d =
                    h && c.READ_FRAMEBUFFER
                      ? c.READ_FRAMEBUFFER
                      : c.FRAMEBUFFER;
                  f = !0;
                }
              },
              Xl: function () {
                return b;
              },
              $h: function () {
                return d;
              },
              qf: function () {
                return c.FRAMEBUFFER;
              },
              cq: function () {
                return p;
              },
              Tp: function () {
                return a;
              },
              instance: function (h) {
                void 0 === h.Hc && (h.Hc = !1);
                var m = h.V ? h.V : null,
                  q = h.width,
                  x = void 0 !== h.height ? h.height : h.width,
                  I = a,
                  u = null,
                  y = !1,
                  A = !1,
                  k = 0;
                m && ((q = q ? q : m.P()), (x = x ? x : m.$()));
                var g = {
                  mj: function () {
                    y || ((I = c.createFramebuffer()), (y = !0), (k = p.Sh++));
                  },
                  ed: function () {
                    g.mj();
                    g.u();
                    u = c.createRenderbuffer();
                    c.bindRenderbuffer(c.RENDERBUFFER, u);
                    c.renderbufferStorage(
                      c.RENDERBUFFER,
                      c.DEPTH_COMPONENT16,
                      q,
                      x
                    );
                    c.framebufferRenderbuffer(
                      b,
                      c.DEPTH_ATTACHMENT,
                      c.RENDERBUFFER,
                      u
                    );
                    c.clearDepth(1);
                  },
                  bind: function (F, L) {
                    k !== p.ma && (c.bindFramebuffer(b, I), (p.ma = k));
                    m && m.u();
                    L && c.viewport(0, 0, q, x);
                    F && c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                  },
                  mh: function () {
                    k !== p.ma && (c.bindFramebuffer(b, I), (p.ma = k));
                  },
                  clear: function () {
                    c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                  },
                  Qe: function () {
                    c.clear(c.COLOR_BUFFER_BIT);
                  },
                  th: function () {
                    c.clear(c.DEPTH_BUFFER_BIT);
                  },
                  Wc: function () {
                    c.viewport(0, 0, q, x);
                  },
                  u: function () {
                    k !== p.ma && (c.bindFramebuffer(b, I), (p.ma = k));
                  },
                  rtt: function (F) {
                    m = F;
                    p.ma !== k &&
                      (c.bindFramebuffer(c.FRAMEBUFFER, I), (p.ma = k));
                    F.u();
                  },
                  aa: function () {
                    c.bindFramebuffer(b, null);
                    p.ma = -1;
                  },
                  resize: function (F, L) {
                    q = F;
                    x = L;
                    u &&
                      (c.bindRenderbuffer(c.RENDERBUFFER, u),
                      c.renderbufferStorage(
                        c.RENDERBUFFER,
                        c.DEPTH_COMPONENT16,
                        q,
                        x
                      ));
                  },
                  remove: function () {
                    I === a ||
                      A ||
                      (c.bindFramebuffer(b, I),
                      c.framebufferTexture2D(
                        b,
                        c.COLOR_ATTACHMENT0,
                        c.TEXTURE_2D,
                        null,
                        0
                      ),
                      u &&
                        c.framebufferRenderbuffer(
                          b,
                          c.DEPTH_ATTACHMENT,
                          c.RENDERBUFFER,
                          null
                        ),
                      c.bindFramebuffer(b, null),
                      (p.ma = -1),
                      c.deleteFramebuffer(I),
                      u && c.deleteRenderbuffer(u));
                    A = !0;
                  },
                };
                h.Hc && g.ed();
                l.push(g);
                return g;
              },
              aa: function () {
                c.bindFramebuffer(b, null);
                p.ma = -1;
              },
              $q: function () {
                c.bindFramebuffer(b, null);
                c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                Ia.Dj();
                p.ma = -1;
              },
              reset: function () {
                p.ma = -2;
              },
              ba: function () {
                0 !== p.ma && (c.bindFramebuffer(b, a), (p.ma = 0));
              },
              clear: function () {
                Ia.Dj();
                c.clear(c.COLOR_BUFFER_BIT);
              },
              A: function () {
                w.aa();
                l.forEach(function (h) {
                  h.remove();
                });
                null !== a && (c.deleteFramebuffer(a), (a = null));
                w.reset();
                f = !1;
                l.splice(0);
                p.Sh = 1;
              },
            };
          return w;
        })(),
        Ia = (function () {
          function a() {
            h = "undefined" === typeof mb ? ha : mb;
            m = !0;
          }
          function b(e, n, z) {
            for (var P = 0; P < n.length; ++P) {
              var B = z.getExtension(n[P] + "_" + e);
              if (B) return B;
            }
            return null;
          }
          function d() {
            null !== g.re && (clearTimeout(g.re), (g.re = null));
            g.Ub = !1;
          }
          function f(e) {
            if (0 === g.wb.length) {
              g.Da = c.PIXEL_PACK_BUFFER;
              g.wb.splice(0);
              g.Ed.splice(0);
              for (var n = 0; n < g.Bc; ++n)
                g.wb.push(c.createBuffer()), g.Ed.push(-1);
              g.Ua = 0;
              g.cg = 0;
            }
            c.bindBuffer(g.Da, g.wb[g.Ua]);
            e.byteLength !== g.Ed[g.Ua] &&
              (c.bufferData(g.Da, e.byteLength, c.STREAM_READ),
              (g.Ed[g.Ua] = e.byteLength));
            g.jq = !0;
          }
          function l() {
            c.bindBuffer(g.Da, null);
          }
          function p() {
            g.Sb.forEach(function (e) {
              c.deleteSync(e);
            });
            g.Sb.splice(0);
          }
          function w() {
            g.Ua = (g.Ua + 1) % g.Bc;
            ++g.cg;
          }
          var h = null,
            m = !1,
            q = {
              ti: !1,
              Og: null,
              Pg: null,
              Ai: !1,
              Pm: !1,
              Qg: null,
              Bi: !1,
              Rg: null,
              ui: !1,
              Re: null,
              Gm: !1,
              Se: null,
              Hm: !1,
            },
            x = null,
            I = { Wa: !0, Ya: !0, gf: !0, cj: !1 },
            u = null,
            y = !0,
            A = null,
            k = null,
            g = {
              gl: 1,
              Bc: -1,
              Ua: 0,
              cg: 0,
              Ub: !1,
              wb: [],
              Sb: [],
              Ed: [],
              Da: null,
              re: null,
            },
            F = "EXT WEBGL OES MOZ_OES WEBKIT_OES KHR".split(" "),
            L = ["OES", "MOZ_OES", "WEBKIT_OES"],
            D = "undefined" === typeof window ? {} : window,
            G = {
              m: function () {
                if (m) return !0;
                G.reset();
                m || a();
                var e = c;
                if (!x.ti) {
                  x.Og = G.Ph(e);
                  D.GL_EXT_FLOAT = x.Og;
                  x.Ai = x.Og ? !0 : !1;
                  if (x.Ai || G.na())
                    (x.Pg = G.Qh(e)),
                      (x.Pm = x.Pg ? !0 : !1),
                      (D.GL_EXT_FLOATLINEAR = x.Pg);
                  x.ti = !0;
                }
                if (!x.ui) {
                  x.Qg = G.wd(e);
                  x.Qg && ((x.Bi = !0), (D.GL_EXT_HALFFLOAT = x.Qg));
                  if (x.Bi || G.na())
                    (x.Rg = G.Rh(e)), (D.GL_EXT_HALFFLOATLINEAR = x.Rg);
                  x.mq = x.Rg ? !0 : !1;
                  x.ui = !0;
                }
                x.Re = G.Nh(e);
                x.Gm = x.Re ? !0 : !1;
                D.GL_EXT_COLORBUFFERFLOAT = x.Re;
                x.Se = G.Oh(e);
                x.Hm = x.Se ? !0 : !1;
                D.GL_EXT_COLORBUFFERHALFFLOAT = x.Se;
                Ea.m();
                ba.m();
                if (!G.ql()) return !1;
                Y.m();
                ba.Am();
                return !0;
              },
              reset: function () {
                x = Object.assign({}, q);
                u = Object.assign({}, I);
              },
              P: function () {
                m || a();
                return h.P();
              },
              $: function () {
                m || a();
                return h.$();
              },
              na: function () {
                m || a();
                return h.na();
              },
              Mh: function (e) {
                G.Nh(e);
                G.Oh(e);
                G.Ph(e);
                G.Qh(e);
                G.wd(e);
                G.Rh(e);
              },
              Nh: b.bind(null, "color_buffer_float", F),
              Oh: b.bind(null, "color_buffer_half_float", F),
              Ph: b.bind(null, "texture_float", L),
              Qh: b.bind(null, "texture_float_linear", L),
              wd: b.bind(null, "texture_half_float", L),
              Rh: b.bind(null, "texture_half_float_linear", L),
              pf: function (e) {
                var n = G.wd(e);
                return n && n.HALF_FLOAT_OES
                  ? n.HALF_FLOAT_OES
                  : e.HALF_FLOAT || e.FLOAT;
              },
              Yl: function () {
                return k || c.RGBA32F || c.RGBA;
              },
              Zl: function () {
                return A || c.RGBA16F || c.RGBA;
              },
              Sl: function () {
                return u;
              },
              ja: function () {
                return u.Wa;
              },
              Dp: function () {
                return u.Ya;
              },
              Zk: function () {
                return u.gf;
              },
              bl: function () {
                return u.cj && y;
              },
              Rj: function (e) {
                y = e;
                !e && g.Ub && (p(), c.bindBuffer(g.Da, null), (g.Ub = !1));
              },
              rq: function () {
                return g.Ub;
              },
              pe: function (e, n, z) {
                function P() {
                  e.bindTexture(e.TEXTURE_2D, null);
                  e.bindFramebuffer(B, null);
                  e.deleteTexture(t);
                  e.deleteFramebuffer(M);
                }
                var B = e.FRAMEBUFFER,
                  E = e.NEAREST,
                  M = e.createFramebuffer();
                e.bindFramebuffer(B, M);
                var t = e.createTexture();
                e.activeTexture(e.TEXTURE0);
                e.bindTexture(e.TEXTURE_2D, t);
                e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1);
                e.texParameteri(
                  e.TEXTURE_2D,
                  e.TEXTURE_WRAP_S,
                  e.CLAMP_TO_EDGE
                );
                e.texParameteri(
                  e.TEXTURE_2D,
                  e.TEXTURE_WRAP_T,
                  e.CLAMP_TO_EDGE
                );
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, E);
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, E);
                e.texImage2D(e.TEXTURE_2D, 0, n, 3, 3, 0, e.RGBA, z, null);
                e.framebufferTexture2D(
                  e.FRAMEBUFFER,
                  e.COLOR_ATTACHMENT0,
                  e.TEXTURE_2D,
                  t,
                  0
                );
                if (
                  e.checkFramebufferStatus(
                    e.READ_FRAMEBUFFER || e.FRAMEBUFFER
                  ) !== e.FRAMEBUFFER_COMPLETE
                )
                  return P(), !1;
                Cb.he(e);
                e.clearColor(0, 0, 0, 0);
                e.viewport(0, 0, 3, 3);
                e.disable(e.DEPTH_TEST);
                e.clear(e.COLOR_BUFFER_BIT);
                Y.Qb(e);
                e.bindFramebuffer(B, null);
                Cb.Eb(e);
                e.activeTexture(e.TEXTURE0);
                e.bindTexture(e.TEXTURE_2D, t);
                Y.Qb(e);
                n = new Uint8Array(36);
                e.readPixels(0, 0, 3, 3, e.RGBA, e.UNSIGNED_BYTE, n);
                P();
                for (z = 0; 36 > z; ++z)
                  if (3 !== z % 4 && 3 < Math.abs(n[z] - 127)) return !1;
                return !0;
              },
              Ze: function (e) {
                var n = { Wa: !1, Ya: !1 };
                e.disable(e.BLEND);
                e.clearColor(0, 0, 0, 0);
                e.clear(e.COLOR_BUFFER_BIT);
                e.RGBA32F &&
                  G.pe(e, e.RGBA32F, e.FLOAT) &&
                  ((n.Wa = !0), (k = e.RGBA32F));
                !n.Wa &&
                  G.pe(e, e.RGBA, e.FLOAT) &&
                  ((n.Wa = !0), (k = e.RGBA));
                var z = G.pf(e);
                A = null;
                e.RGBA16F &&
                  G.pe(e, e.RGBA16F, z) &&
                  ((n.Ya = !0), (A = e.RGBA16F));
                !n.Ya && G.pe(e, e.RGBA, z) && ((n.Ya = !0), (A = e.RGBA));
                return n;
              },
              sl: function () {
                var e = Ea.instance({ width: 2 });
                e.mj();
                var n = ba.instance({ width: 2, isFloat: !0, L: 3 });
                e.u();
                n.u();
                G.flush();
                c.checkFramebufferStatus(Ea.$h()) !== c.FRAMEBUFFER_COMPLETE
                  ? (ba.uo(), (u.gf = !1))
                  : (u.gf = !0);
                e.remove();
                n.remove();
              },
              tl: function () {
                var e = !1;
                G.na() &&
                  (e =
                    "PIXEL_PACK_BUFFER STREAM_READ SYNC_GPU_COMMANDS_COMPLETE WAIT_FAILED fenceSync deleteSync createBuffer"
                      .split(" ")
                      .every(function (n) {
                        return "undefined" !== typeof c[n];
                      }));
                u.cj = e;
              },
              ql: function () {
                var e = G.Ze(c);
                Object.assign(u, e);
                if (!u.Wa && !u.Ya) return !1;
                G.sl();
                G.tl();
                return !0;
              },
              Kn: function (e, n, z, P, B) {
                c.readPixels(e, n, z, P, c.RGBA, c.UNSIGNED_BYTE, B);
                return Promise.resolve(B, !1);
              },
              og: function (e, n, z, P, B, E, M) {
                if (!G.bl()) return G.Kn(e, n, z, P, B);
                g.Bc = M || g.gl;
                f(B);
                c.readPixels(e, n, z, P, c.RGBA, c.UNSIGNED_BYTE, 0);
                g.Sb[g.Ua] = c.fenceSync(c.SYNC_GPU_COMMANDS_COMPLETE, 0);
                G.flush();
                var t = !1;
                return new Promise(function (v, Q) {
                  function X() {
                    if (!g.Ub) return d(), l(), w(), Q(), !1;
                    var U = (g.Ua + 1) % g.Bc;
                    switch (c.clientWaitSync(g.Sb[U], 0, 0)) {
                      case c.TIMEOUT_EXPIRED:
                      case c.WAIT_FAILED:
                        break;
                      default:
                        return (
                          d(),
                          c.deleteSync(g.Sb[U]),
                          (g.Sb[U] = null),
                          c.bindBuffer(g.Da, g.wb[U]),
                          c.getBufferSubData(g.Da, 0, B),
                          l(),
                          w(),
                          v(B, t),
                          !0
                        );
                    }
                    g.re = setTimeout(X, 0);
                    return !1;
                  }
                  d();
                  g.cg + 1 < g.Bc
                    ? (l(), w(), v(B, !1))
                    : ((g.Ub = !0), X() || !E || t || ((t = !0), E()));
                });
              },
              Dj: function () {
                c.viewport(0, 0, G.P(), G.$());
              },
              flush: function () {
                c.flush();
              },
              A: function () {
                d();
                p();
                ba.A();
                Ea.A();
                Y.A();
                g.wb.forEach(function (e) {
                  c.deleteBuffer(e);
                });
                g.wb.splice(0);
                Cb.reset();
                m = !1;
              },
            };
          return G;
        })(),
        Hb = (function () {
          function a(e, n, z, P) {
            g.texParameteri(
              g.TEXTURE_2D,
              g.TEXTURE_MIN_FILTER,
              P ? g.NEAREST_MIPMAP_NEAREST : g.LINEAR
            );
            var B = null;
            if (null !== z)
              try {
                B = g.getError();
                if ("BIG_ERROR" === B) return !1;
                g.texImage2D(g.TEXTURE_2D, 0, e, 4, 4, 0, g.RGBA, n, z);
                B = g.getError();
                if (B !== g.NO_ERROR) return !1;
              } catch (E) {
                return !1;
              }
            P && g.generateMipmap(g.TEXTURE_2D);
            g.clear(g.COLOR_BUFFER_BIT);
            Y.Qb(g);
            B = g.getError();
            if ("BIG_ERROR" === B) return !1;
            g.readPixels(0, 0, 2, 2, g.RGBA, g.UNSIGNED_BYTE, x);
            B = g.getError();
            B === g.INVALID_OPERATION &&
              "undefined" !== typeof g.PIXEL_PACK_BUFFER &&
              (g.bindBuffer(g.PIXEL_PACK_BUFFER, null),
              g.readPixels(0, 0, 2, 2, g.RGBA, g.UNSIGNED_BYTE, x),
              (B = g.getError()));
            if (B !== g.NO_ERROR) return !1;
            z = !0;
            for (P = 0; 16 > P; ++P) z = z && 4 > Math.abs(x[P] - 127);
            z && ((m.Zi = n), (m.si = e));
            return z;
          }
          function b(e, n) {
            return F.Wa && a(e, g.FLOAT, new Float32Array(I), n)
              ? ((h = w.hh), !0)
              : !1;
          }
          function d(e, n, z) {
            if (!F.Ya) return !1;
            var P = ba.fl(I),
              B = Ia.wd(g);
            if (
              (B && B.HALF_FLOAT_OES && a(e, B.HALF_FLOAT_OES, P, n)) ||
              (g.HALF_FLOAT && a(e, g.HALF_FLOAT, P, n))
            )
              return (h = w.tc), !0;
            P = new Float32Array(I);
            if (a(e, g.FLOAT, P, n)) return (h = w.tc), !0;
            g.bindTexture(g.TEXTURE_2D, z);
            g.texImage2D(
              g.TEXTURE_2D,
              0,
              g.RGBA,
              2,
              2,
              0,
              g.RGBA,
              g.UNSIGNED_BYTE,
              null
            );
            g.bindFramebuffer(m.rd, G);
            ba.Th(g, z, 2, 2, P, !1, !1);
            g.bindFramebuffer(m.rd, null);
            g.bindTexture(g.TEXTURE_2D, z);
            return a(e, null, null, n) ? ((h = w.tc), !0) : !1;
          }
          function f(e, n, z) {
            q = !0;
            if (d(e, !0, z) || b(n, !0)) return !0;
            q = !1;
            return d(e, !1, z) || b(n, !1) ? !0 : !1;
          }
          function l(e) {
            if (h === w.M) {
              g = e || c;
              h = w.RGBA8;
              q = !0;
              Ia.Mh(g);
              F || (F = Ia.Ze(g));
              Ea.reset();
              G = g.createFramebuffer();
              m.rd = g.DRAW_FRAMEBUFFER || g.FRAMEBUFFER;
              g.bindFramebuffer(m.rd, null);
              g.clearColor(0, 0, 0, 0);
              g.viewport(0, 0, 2, 2);
              aa.M();
              L = aa.Eb(g);
              e = g.createTexture();
              g.activeTexture(g.TEXTURE0);
              g.bindTexture(g.TEXTURE_2D, e);
              g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
              g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
              g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
              D = e;
              var n = (e = g.RGBA),
                z = g.RGBA16F,
                P = g.RGBA32F;
              P && (e = P);
              z && (n = z);
              if ((z || P) && f(n, e, D)) return p(), !0;
              e = n = g.RGBA;
              if (f(n, e, D)) return p(), !0;
              h = w.RGBA8;
              p();
              return !1;
            }
          }
          function p() {
            g.deleteProgram(L.qa);
            g.deleteTexture(D);
            D = L = null;
          }
          for (
            var w = { M: -1, hh: 3, tc: 2, RGBA8: 0 },
              h = w.M,
              m = { Zi: null, si: null, rd: null },
              q = !0,
              x = new Uint8Array(16),
              I = Array(64),
              u = 0;
            4 > u;
            ++u
          )
            for (var y = 0; 4 > y; ++y) {
              var A = 0 === (y + u) % 2 ? 1 : 0,
                k = 4 * u + y;
              I[4 * k] = A;
              I[4 * k + 1] = A;
              I[4 * k + 2] = A;
              I[4 * k + 3] = A;
            }
          var g = null,
            F = null,
            L = null,
            D = null,
            G = null;
          return {
            $k: function (e) {
              l(e);
              return q;
            },
            rh: function (e, n) {
              h === w.M && (typeof ("undefined" !== n) && (F = n), l(e));
              return h !== w.RGBA8;
            },
            nq: function (e) {
              l(e);
              return h === w.hh;
            },
            Tm: function (e) {
              l(e);
              return h === w.tc;
            },
            Zp: function (e) {
              l(e);
              return m.Zi;
            },
            $l: function (e) {
              l(e);
              return m.si;
            },
            A: function () {
              g = null;
              q = !0;
              h = w.M;
              F = null;
            },
          };
        })(),
        Cd = {
          instance: function (a) {
            function b() {
              x && x.remove();
              x = ba.instance({
                isFloat: !1,
                isPot: !1,
                width: d.size * d.za[0],
                height: d.size * d.za[1],
              });
            }
            var d = Object.assign(
                {
                  mask: null,
                  size: -1,
                  preprocessing: "none",
                  preprocessingSize: a.size,
                  customInputShader: null,
                  nBlurPass: 1,
                  varianceMin: 0.1,
                  blurKernelSizePx: 5,
                  gain: 1,
                  overlap: 0,
                  isNormalized: !1,
                  tilt: -1,
                  za: [1, 1],
                },
                a
              ),
              f = null,
              l = !1,
              p = !1,
              w = null,
              h = !1;
            a = !1;
            var m = null;
            d.mask &&
              ((l = !0),
              J && void 0 !== J.ea && (d.mask = J.ea + d.mask),
              (f = ba.instance({ isFloat: !1, url: d.mask })));
            var q = null;
            d.customInputShader &&
              ((q = "s50"),
              aa.oa({
                name: "_",
                id: q,
                g: d.customInputShader,
                ar: ["uSource"],
                precision: "lowp",
              }),
              aa.j(q, [{ type: "1i", name: "_", value: 0 }]));
            switch (d.preprocessing) {
              case "sobel":
                m = "s39";
                h = !0;
                break;
              case "meanNormalization":
                m = "s40";
                h = !0;
                break;
              case "grayScale":
                m = "s36";
                h = !1;
                break;
              case "grayScaleTilt":
                m = "s37";
                a = !0;
                h = !1;
                break;
              case "rgbGrayTilt":
                m = "s38";
                a = !0;
                h = !1;
                break;
              case "copy":
                m = q ? q : "s0";
                break;
              case "inputLightRegulation":
                m = q ? q : "s36";
                w = Ud.instance({
                  ri: d.preprocessingSize,
                  Ti: d.size,
                  Oi: d.nBlurPass,
                  Ea: !1,
                });
                p = !0;
                break;
              case "inputMix0":
                m = "none";
                w = Vd.instance({
                  da: d.preprocessingSize,
                  jb: d.varianceMin,
                  Ta: d.blurKernelSizePx,
                  gain: d.gain || 1,
                  Ea: !1,
                });
                p = !0;
                break;
              case "inputMix1":
                m = "none";
                w = Wd.instance({
                  da: d.preprocessingSize,
                  jb: d.varianceMin,
                  Ta: d.blurKernelSizePx,
                  gain: d.gain || 1,
                  Ea: !1,
                });
                p = !0;
                break;
              case "inputCut4":
                m = "none";
                w = Xd.instance({
                  da: d.preprocessingSize,
                  jb: d.varianceMin,
                  Ta: d.blurKernelSizePx,
                  gain: d.gain || 1,
                  Jc: d.isNormalized || !1,
                  ig: d.overlap || 0,
                  Ea: !1,
                });
                d.preprocessingSize *= w.am();
                p = !0;
                break;
              case "direct":
              case "none":
              case "abort":
                m = "abort";
                break;
              default:
                m = "s4";
            }
            d.preprocessingSize = Math.ceil(d.preprocessingSize);
            a && aa.j(m, [{ name: "u29", type: "1f", value: d.tilt }]);
            l && (m += "Mask");
            var x = null;
            b();
            var I = {
              P: function () {
                return d.size;
              },
              bm: function () {
                return d.preprocessingSize;
              },
              rf: function () {
                return I.P();
              },
              fm: function () {
                return p ? w.Fc() : x;
              },
              te: function (u) {
                d.za = u;
                b();
              },
              Aa: function (u) {
                Ea.ba();
                if ("abort" === m) return u.h(0), u;
                "none" !== m &&
                  (aa.set(m),
                  h && aa.C("u30", 1 / d.size),
                  x.J(),
                  l && f.h(1),
                  Y.l(!1, !1),
                  x.h(0),
                  (u = x));
                p && w.process(u);
              },
              A: function () {
                x.remove();
                l && f.remove();
              },
            };
            return I;
          },
        },
        Dd = {
          instance: function (a) {
            function b() {
              if (G.lc) {
                l.input && (l.input.remove(), l.Hd.remove());
                var n = a.size * a.sparsity;
                D = Math.log(n / a.size) / Math.log(2);
                l.input = ba.instance({
                  isMipmap: !0,
                  isFloat: !0,
                  isPot: !0,
                  width: n * a.za[0],
                  height: n * a.za[1],
                  Vf: D,
                });
                l.Hd = ba.instance({
                  isFloat: !0,
                  isPot: !0,
                  width: a.size * a.za[0],
                  height: a.size * a.za[1],
                });
              }
            }
            function d() {
              l.output && l.output.remove();
              l.output = ba.instance({
                isFloat: !0,
                isPot: !w,
                isLinear: !w && h.isLinear,
                width: a.size * a.za[0],
                height: a.size * a.za[1],
              });
            }
            function f(n) {
              h.buffer.forEach(function (z, P) {
                h.results[P][0] = n[0][z];
                h.results[P][1] = n[1][z];
                h.results[P][2] = n[2][z];
                h.results[P][3] = n[3][z];
              });
              return h.results;
            }
            a.normalize = a.normalize || !1;
            var l = {
                input: null,
                bias: null,
                Hd: null,
                output: null,
                hg: null,
                fg: null,
                gg: null,
              },
              p = null,
              w = !0,
              h = {
                type: "undef",
                D: null,
                isLinear: !1,
                buffer: [],
                results: [],
                Ld: !1,
              },
              m = -1,
              q = a.isReorganize ? a.isReorganize : !1,
              x = a.kernelsCount ? !0 : !1,
              I = [a.Ic ? "s32" : "s31", a.Ic ? "s34" : "s33", "s35"][
                a.shiftRGBAMode || 0
              ],
              u = { isEnabled: !1 },
              y = 1 / a.size;
            a.Mm
              ? ((a.sparsity =
                  "undefined" !== typeof a.sparsity ? a.sparsity : a.de.rf()),
                (w = !1))
              : "full" === a.connectivityUp && (a.sparsity = a.de.rf());
            var A = {
                elu: "s19",
                elu01: "s20",
                relu: "s17",
                gelu: "s18",
                arctan: "s21",
                arctan2: "s22",
                sigmoid: "s16",
                copy: "s0",
              }[a.activation],
              k = a.sparsity * a.sparsity,
              g = !1,
              F = a.size,
              L = "";
            if (a.maxPooling) {
              switch (a.maxPooling.size) {
                case 2:
                  L = "s41";
                  break;
                case 4:
                  L = "s42";
              }
              g = !0;
              F /= a.maxPooling.size;
              l.fg = ba.instance({ isFloat: !0, isPot: !1, width: F });
            }
            var D = -1,
              G = null;
            w && d();
            l.bias = ba.instance(a.bias);
            var e = {
              P: function () {
                return a.size;
              },
              rf: function () {
                return F;
              },
              Xh: function () {
                return a.classesCount;
              },
              Rk: function (n) {
                p.h(n);
              },
              Bn: function () {
                a.remap &&
                  a.remap.isEnabled &&
                  (u = {
                    isEnabled: !0,
                    gn: ba.instance(a.remap.maskTexture),
                    Nc: a.remap.layers.map(function (n) {
                      return a.parent.cm(n);
                    }),
                    depth: a.remap.depth,
                  });
              },
              vo: function () {
                switch (a.connectivityUp) {
                  case "direct":
                    G = Yd.instance(a.connectivity);
                    break;
                  case "square":
                    G = Zd.instance(a.connectivity);
                    break;
                  case "squareFast":
                    G = $d.instance(a.connectivity, a.activation);
                    break;
                  case "full":
                    G = ae.instance(
                      Object.assign({ Ic: a.Ic }, a.connectivity)
                    );
                    break;
                  case "conv":
                    (m = a.kernelsCount),
                      (G = be.instance(a.connectivity)),
                      q &&
                        (l.hg = ba.instance({
                          width: F,
                          isFloat: !0,
                          isFlipY: !1,
                          isPot: !1,
                        }));
                }
                b();
              },
              Aa: function (n, z) {
                p = n;
                G.lc
                  ? (l.input.J(),
                    x && l.bias.h(2),
                    G.Aa(u),
                    l.input.h(0),
                    l.input.Pl(D),
                    l.Hd.J(),
                    x ? aa.set("s0") : (aa.set(I), aa.C("u4", k), l.bias.h(1)),
                    l.input.Sk(D, 0),
                    Y.l(!1, !1),
                    aa.set(A),
                    l.output.u(),
                    l.Hd.h(0),
                    Y.l(!1, !1))
                  : (l.output.J(), l.bias.h(1), G.Aa());
                if (w)
                  return (
                    (z = l.output),
                    g &&
                      (l.fg.J(),
                      z.h(0),
                      aa.set(L),
                      aa.O("u14", y, y),
                      Y.l(!1, !1),
                      (z = l.fg)),
                    q &&
                      (l.hg.u(),
                      aa.set("s24"),
                      aa.O("u18", m, F / m),
                      z.h(0),
                      Y.l(!1, !1),
                      (z = l.hg)),
                    z.h(0),
                    z
                  );
                var P = l.output;
                if (a.normalize || h.Ld)
                  (n = a.normalize),
                    aa.set(h.Ld ? "s9" : "s8"),
                    aa.C("u10", n ? y : 1),
                    l.gg.J(),
                    P.h(0),
                    Y.l(!1, !1),
                    (P = l.gg);
                n = null;
                switch (h.type) {
                  case "cpuRGBA2Float":
                    P.Fh(!1);
                    z ? (n = e.Fn(P).then(h.D)) : ((P = e.Gn(P)), h.D(P));
                    break;
                  case "cpuMeanFloat":
                    P.Fh(!0);
                    if (z) n = P.In().then(h.D);
                    else {
                      P = P.Jn();
                      for (var B = 0; B < P.length; ++B);
                      h.D(P);
                    }
                    break;
                  case "gpuRawAvg":
                  case "gpuRaw":
                    P.h(0);
                  case "none":
                    null !== h.D && h.D(P);
                }
                z && null === n && (n = Promise.resolve());
                return n;
              },
              te: function (n) {
                a.za = n;
                b();
                d();
              },
              Do: function (n) {
                n &&
                  ((h.type = n.Zd || "none"),
                  (h.D = n.Yd || null),
                  (h.isLinear = n.eg ? !0 : !1));
                d();
                n =
                  "undefined" !== typeof a.classesCount && a.classesCount
                    ? a.classesCount
                    : a.size * a.size;
                for (var z = 0, P = 0, B = 0; z < n; ++z)
                  h.buffer.push(P + (a.size - 1 - B) * a.size),
                    h.results.push([-1, -1, -1, -1]),
                    ++P,
                    P === a.size && ((P = 0), ++B);
                h.Ld = "gpuRawAvg" === h.type || "cpuMeanFloat" === h.type;
                if (a.normalize || h.Ld)
                  l.gg = ba.instance({ isFloat: !0, isPot: !0, width: a.size });
              },
              Fn: function (n) {
                return n.Hn().then(f);
              },
              Gn: function (n) {
                n = n.dj();
                f(n);
                return h.results;
              },
              A: function () {
                for (var n in l) {
                  var z = l[n];
                  z && z.remove();
                }
                G && (G.A(), (G = null));
              },
            };
            a.de && e.vo(a.de);
            return e;
          },
        },
        Yd = {
          instance: function (a) {
            var b = ba.instance(a.weights);
            return {
              lc: !0,
              Bd: function () {
                return 1;
              },
              A: function () {
                b.remove();
              },
              um: function () {
                return b;
              },
              Aa: function () {
                aa.set("s30");
                b.h(1);
                Y.l(!1, !1);
              },
            };
          },
        },
        ae = {
          instance: function (a) {
            var b = a.fromLayerSize,
              d = ba.instance(a.weights),
              f = a.Ic ? "s27" : "s26";
            return {
              lc: !0,
              Bd: function () {
                return b;
              },
              A: function () {
                d.remove();
              },
              Aa: function (l) {
                if (l.isEnabled) {
                  aa.set("s28");
                  l.gn.h(3);
                  for (
                    var p = Math.min(l.Nc.length, l.depth), w = 0;
                    w < p;
                    ++w
                  )
                    l.Nc[w].Rk(4 + w);
                } else aa.set(f);
                aa.C("u8", a.toLayerSize);
                aa.C("u9", a.fromLayerSize);
                d.h(1);
                Y.l(!1, !1);
              },
            };
          },
        },
        Zd = {
          instance: function (a) {
            for (
              var b = a.fromLayerSize,
                d = a.toLayerSize,
                f = a.toSparsity,
                l = f * d,
                p = l / b,
                w = b / d,
                h = 0,
                m = 0,
                q = 0,
                x = Array(f * d * f * d * 4),
                I = Array(f * d * f * d * 4),
                u = Array(b * b),
                y = 0;
              y < u.length;
              ++y
            )
              u[y] = 0;
            y = Math.floor(f / 2);
            for (var A = 0.5 / d, k = 0.5 / b, g = 0.5 / l, F = 0; F < d; ++F)
              for (var L = Math.round(F * w), D = 0; D < d; ++D) {
                var G = Math.round(D * w),
                  e = F / d,
                  n = D / d;
                e += A;
                n += A;
                for (var z = 0; z < f; ++z) {
                  var P = L + z - y;
                  0 > P && (P += b);
                  P >= b && (P -= b);
                  for (var B = 0; B < f; ++B) {
                    var E = h / l,
                      M = m / l,
                      t = G + B - y;
                    0 > t && (t += b);
                    t >= b && (t -= b);
                    var v = P / b,
                      Q = t / b;
                    M = 1 - M - 1 / l;
                    v += k;
                    Q += k;
                    E += g;
                    M += g;
                    var X = F * f + z,
                      U = D * f + B;
                    U = d * f - U - 1;
                    X = U * d * f + X;
                    x[4 * X] = E;
                    x[4 * X + 1] = M;
                    x[4 * X + 2] = v;
                    x[4 * X + 3] = Q;
                    Q = u[t * b + P]++;
                    X = Q % p;
                    v = P * p + X;
                    t = t * p + (Q - X) / p;
                    t = b * p - 1 - t;
                    t = t * b * p + v;
                    I[4 * t] = E;
                    I[4 * t + 1] = M;
                    I[4 * t + 2] = e;
                    I[4 * t + 3] = n;
                    ++h >= l && ((h = 0), ++m);
                    ++q;
                  }
                }
              }
            u = null;
            var ia = ba.instance(a.weights);
            delete a.weights.data;
            var O = ba.instance({
              width: l,
              isFloat: !0,
              array: new Float32Array(I),
              isPot: !0,
            });
            I = null;
            var ka = ba.instance({
              width: l,
              isFloat: !0,
              array: new Float32Array(x),
              isPot: !0,
            });
            x = null;
            return {
              lc: !0,
              Bd: function () {
                return p;
              },
              A: function () {
                O.remove();
                ka.remove();
                ia.remove();
              },
              Aa: function () {
                aa.set("s25");
                ia.h(1);
                ka.h(2);
                Y.l(!1, !1);
              },
            };
          },
        },
        be = {
          instance: function (a) {
            var b = a.kernelsCount,
              d = a.toSparsity,
              f = (d * a.toLayerSize) / a.fromLayerSize,
              l = a.inputScale || [1, 1],
              p = ba.instance(a.weights);
            return {
              lc: !0,
              Bd: function () {
                return f;
              },
              gq: function () {
                return d;
              },
              um: function () {
                return p;
              },
              A: function () {
                p.remove();
              },
              Aa: function () {
                aa.set("s29");
                aa.Bg("u28", l);
                aa.C("u26", b);
                aa.C("u27", d);
                aa.C("u8", a.toLayerSize);
                aa.C("u9", a.fromLayerSize);
                p.h(1);
                Y.l(!1, !1);
              },
            };
          },
        },
        $d = {
          instance: function (a, b) {
            var d = a.fromLayerSize,
              f = a.toLayerSize,
              l = a.toSparsity,
              p = a.stride ? a.stride : 1,
              w = (l * f) / d,
              h = f < d,
              m = d / f,
              q = ba.instance(a.weights),
              x =
                "s51" +
                [
                  d.toString(),
                  f.toString(),
                  l.toString(),
                  p.toString(),
                  b,
                ].join("_");
            aa.Kl(x) ||
              ((a = vb(b)),
              (f = [
                { type: "1f", name: "u8", value: f },
                { type: "1f", name: "u32", value: p },
              ]),
              h && f.push({ type: "1f", name: "u9", value: d }),
              (d = [(h ? w : l).toFixed(1), a]),
              h && d.push(m.toFixed(1)),
              aa.Cm(h ? "s47" : "s46", x, d),
              aa.j(
                x,
                f.concat([
                  { type: "1i", name: "u6", value: 0 },
                  { type: "1i", name: "u3", value: 1 },
                  { type: "1i", name: "u7", value: 3 },
                ])
              ));
            return {
              lc: !1,
              Bd: function () {
                return w;
              },
              A: function () {
                q.remove();
              },
              Aa: function () {
                aa.set(x);
                q.h(3);
                Y.l(!1, !1);
              },
            };
          },
        },
        Ud = {
          instance: function (a) {
            var b = a.Oi ? a.Oi : 3,
              d = a.ri ? a.ri : 64,
              f = a.Ti ? a.Ti : 64,
              l = a.Ea ? !0 : !1;
            a = { isFloat: !1, width: d, isPot: !1, isFlipY: !1 };
            var p = ba.instance(a),
              w = ba.instance(a),
              h = ba.instance(a),
              m = ba.instance(a),
              q = ba.instance({
                isFloat: !0,
                width: f,
                isPot: !1,
                isFlipY: !1,
              }),
              x = 1 / d;
            return {
              process: function (I) {
                aa.set("s43");
                m.u();
                Y.l(l, !1);
                aa.set("s44");
                for (var u = 0; u < b; ++u)
                  p.u(),
                    aa.O("u14", x, 0),
                    Y.l(l, !1),
                    h.u(),
                    m.h(0),
                    Y.l(l, !1),
                    w.u(),
                    p.h(0),
                    aa.O("u14", 0, x),
                    Y.l(l, !1),
                    m.u(),
                    h.h(0),
                    Y.l(l, !1),
                    u !== b - 1 && w.h(0);
                aa.set("s45");
                q.u();
                I.h(0);
                w.h(1);
                m.h(2);
                Y.l(l, !1);
                q.h(0);
              },
              Fc: function () {
                return q;
              },
            };
          },
        },
        Vd = {
          instance: function (a) {
            function b(x) {
              return ba.instance({
                isFloat: x,
                width: d.da,
                isPot: !1,
                isFlipY: !1,
              });
            }
            var d = Object.assign(
                { jb: 0.1, Ta: 9, da: 128, gain: 1, Ea: !1 },
                a
              ),
              f = b(!1),
              l = [b(!1), b(!1), b(!1)],
              p = [b(!1), b(!1), b(!1)],
              w = b(!0),
              h = [f, p[0], p[1]];
            a =
              "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u33;varying vec2 vv0;void main(){float b=0.,c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u33*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).r,c+=f;}b/=c,gl_FragColor=vec4(b,0.,0.,1.);}"
                .replace("1.1111", Math.round((d.Ta - 1) / 2).toFixed(2))
                .replace("2.2222", (1 / d.da).toFixed(6));
            var m =
                "uniform sampler2D u34,u35,u36,u37;const float f=1.1111;const vec3 g=vec3(1.);const float h=2.2222;varying vec2 vv0;void main(){vec3 a=texture2D(u34,vv0).rgb;float c=texture2D(u35,vv0).r,d=texture2D(u36,vv0).r,i=texture2D(u37,vv0).r,j=a.r*a.r;vec3 b=vec3(c,d,i),k=max(g*f,abs(vec3(j)-b*b)),l=sqrt(k);gl_FragColor=vec4(a.r,h*(a-b)/l);}"
                  .replace("1.1111", d.jb.toFixed(4))
                  .replace("2.2222", d.gain.toFixed(4)),
              q = { u1: 0 };
            aa.uc([
              {
                id: "s53",
                name: "_",
                g: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.);void main(){vec3 b=texture2D(u1,vv0).rgb;float a=dot(b,f);gl_FragColor=vec4(a,a,a,a);}",
                o: q,
                i: ["u1"],
                precision: "lowp",
              },
              {
                id: "s54",
                name: "_",
                g: a,
                o: q,
                i: ["u1", "u33"],
                precision: "lowp",
              },
              {
                id: "s55",
                name: "_",
                g: m,
                o: { u34: 0, u35: 1, u36: 2, u37: 3 },
                i: ["u34", "u35", "u36", "u37"],
                precision: "highp",
              },
            ]);
            return {
              process: function () {
                aa.set("s53");
                f.J();
                Y.l(d.Ea, !1);
                aa.set("s54");
                for (var x = 0; 3 > x; ++x)
                  aa.O("u33", 1, 0),
                    l[x].u(),
                    h[x].h(0),
                    Y.l(!1, !1),
                    aa.O("u33", 0, 1),
                    p[x].u(),
                    l[x].h(0),
                    Y.l(!1, !1);
                aa.set("s55");
                w.u();
                f.h(0);
                p[0].h(1);
                p[1].h(2);
                p[2].h(3);
                Y.l(!1, !1);
                w.h(0);
              },
              Fc: function () {
                return w;
              },
            };
          },
        },
        Wd = {
          instance: function (a) {
            function b(q) {
              return ba.instance({
                isFloat: q,
                width: d.da,
                isPot: !1,
                isFlipY: !1,
              });
            }
            var d = Object.assign(
                { jb: 0.1, Ta: 9, da: 128, gain: 1, Ea: !1 },
                a
              ),
              f = b(!1),
              l = b(!1),
              p = b(!1),
              w = b(!0);
            a =
              "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u33;varying vec2 vv0;void main(){vec3 b=vec3(0.);float c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u33*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).rgb,c+=f;}b/=c,gl_FragColor=vec4(b,1.);}"
                .replace("1.1111", Math.round((d.Ta - 1) / 2).toFixed(2))
                .replace("2.2222", (1 / d.da).toFixed(6));
            var h =
                "uniform sampler2D u0,u38;const float f=1.1111;const vec3 g=vec3(1.);const float h=2.2222;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);vec3 c=texture2D(u38,vv0).rgb;float d=a.a*a.a;vec3 b=c.rgb,i=max(g*f,abs(vec3(d)-b*b)),j=sqrt(i);gl_FragColor=vec4(a.a,h*(a.rgb-b)/j);}"
                  .replace("1.1111", d.jb.toFixed(4))
                  .replace("2.2222", d.gain.toFixed(4)),
              m = { u1: 0 };
            aa.uc([
              {
                id: "s56",
                name: "_",
                g: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.);void main(){vec3 a=texture2D(u1,vv0).rgb;float b=dot(a,f);gl_FragColor=vec4(a.rgb,b);}",
                o: m,
                i: ["u1"],
                precision: "lowp",
              },
              {
                id: "s57",
                name: "_",
                g: a,
                o: m,
                i: ["u1", "u33"],
                precision: "lowp",
              },
              {
                id: "s58",
                name: "_",
                g: h,
                o: { u0: 0, u38: 1 },
                i: ["u0", "u38"],
                precision: "highp",
              },
            ]);
            return {
              process: function () {
                aa.set("s56");
                f.J();
                Y.l(d.Ea, !1);
                aa.set("s57");
                aa.O("u33", 1, 0);
                l.u();
                f.h(0);
                Y.l(!1, !1);
                aa.O("u33", 0, 1);
                p.u();
                l.h(0);
                Y.l(!1, !1);
                aa.set("s58");
                w.u();
                f.h(0);
                p.h(1);
                Y.l(!1, !1);
                w.h(0);
              },
              Fc: function () {
                return w;
              },
            };
          },
        },
        Xd = {
          instance: function (a) {
            function b(x) {
              return ba.instance({
                isFloat: x,
                width: d.da,
                isPot: !1,
                isFlipY: !1,
              });
            }
            var d = Object.assign(
                { jb: 0.1, Ta: 9, da: 128, gain: 1, ig: 0, Jc: !1, Ea: !1 },
                a
              ),
              f = b(!1),
              l = null,
              p = null,
              w = null;
            d.Jc && ((l = b(!1)), (p = b(!1)), (w = b(!0)));
            a = { u1: 0 };
            var h = [
              {
                id: "s59",
                name: "_",
                g: "uniform sampler2D u1;const float f=1.1111;varying vec2 vv0;const vec3 e=vec3(.2126,.7152,.0722);void main(){vec2 a=vv0*.5*(f+1.);float b=.5*(1.-f),c=dot(texture2D(u1,a).rgb,e),d=dot(texture2D(u1,a+vec2(0.,b)).rgb,e),h=dot(texture2D(u1,a+vec2(b,0.)).rgb,e),i=dot(texture2D(u1,a+vec2(b,b)).rgb,e);gl_FragColor=vec4(c,d,h,i);}".replace(
                  "1.1111",
                  d.ig.toFixed(4)
                ),
                o: a,
                i: ["u1"],
                precision: "lowp",
              },
            ];
            if (d.Jc) {
              var m =
                  "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u33;varying vec2 vv0;void main(){vec4 b=vec4(0.);float c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u33*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j),c+=f;}gl_FragColor=b/c;}"
                    .replace("1.1111", Math.round((d.Ta - 1) / 2).toFixed(2))
                    .replace("2.2222", (1 / d.da).toFixed(6)),
                q =
                  "uniform sampler2D u0,u38;const float f=1.1111;const vec4 g=vec4(1.);const float h=2.2222;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u38,vv0),d=a*a,b=c,i=max(g*f,abs(d-b*b)),j=sqrt(i);gl_FragColor=h*(a-b)/j;}"
                    .replace("1.1111", d.jb.toFixed(4))
                    .replace("2.2222", d.gain.toFixed(4));
              h.push(
                {
                  id: "s60",
                  name: "_",
                  g: m,
                  o: a,
                  i: ["u1", "u33"],
                  precision: "lowp",
                },
                {
                  id: "s61",
                  name: "_",
                  g: q,
                  o: { u0: 0, u38: 1 },
                  i: ["u0", "u38"],
                  precision: "highp",
                }
              );
            }
            aa.uc(h);
            return {
              process: function () {
                aa.set("s59");
                f.J();
                Y.l(d.Ea, !1);
                d.Jc
                  ? (aa.set("s60"),
                    aa.O("u33", 1, 0),
                    l.u(),
                    f.h(0),
                    Y.l(!1, !1),
                    aa.O("u33", 0, 1),
                    p.u(),
                    l.h(0),
                    Y.l(!1, !1),
                    aa.set("s61"),
                    w.u(),
                    f.h(0),
                    p.h(1),
                    Y.l(!1, !1),
                    w.h(0))
                  : f.h(0);
              },
              am: function () {
                return 2 - d.ig;
              },
              Fc: function () {
                return d.Jc ? w : f;
              },
            };
          },
        },
        Ob = (function () {
          function a(g, F, L, D, G, e, n) {
            if (!A)
              if (n === e.length) G();
              else {
                switch (e[n]) {
                  case "A":
                    L();
                    break;
                  case "D":
                    g();
                    break;
                  case "S":
                    F()
                      .then(function (z, P) {
                        k.Qj();
                        a(g, F, L, P ? null : D, G, e, ++n);
                      })
                      .catch(function (z) {
                        console.log("An error occurred in the WebAR loop: ", z);
                        G();
                      });
                    return;
                  case "R":
                    D && D();
                }
                a(g, F, L, D, G, e, ++n);
              }
          }
          var b = {
              n: 5,
              bg: 1,
              Lf: 0,
              Ol: [25, 39],
              Bh: 45,
              vd: [2, 200],
              k: 0.7,
              So: 200,
              vn: 0.05,
            },
            d = -1,
            f = null,
            l = -1,
            p = -1,
            w = 0,
            h = -1,
            m = -1,
            q = 0,
            x = null,
            I = 0,
            u = b.vd[1],
            y = Math.log(2),
            A = !0,
            k = {
              X: function () {
                switch (d) {
                  case -1:
                    return -1;
                  case 0:
                    return m + f.Lf;
                  case 1:
                    return q;
                }
              },
              Yh: function (g) {
                switch (d) {
                  case -1:
                    return 1;
                  case 0:
                    return Math.pow(
                      Math.min(Math.max(h, 0), f.n - 1) / (f.n - 1),
                      g || 1
                    );
                  case 1:
                    return (q - f.Lf) / (f.n - 1);
                }
              },
              m: function (g) {
                f = Object.assign({}, b, g);
                h = m = f.bg;
                d = 0;
                x = f.Ol.slice(0);
                k.reset();
                k.Jl().then(function (F) {
                  F >= f.Bh || ((F /= f.Bh), (x[0] *= F), (x[1] *= F));
                });
              },
              Qj: function (g) {
                g = ("undefined" === typeof g ? Date.now() : g) || 0;
                var F = Math.min(Math.max(g - I, f.vd[0]), f.vd[1]);
                u = F;
                I = g;
                var L = -1 === l ? 0 : f.k;
                l = Math.min(Math.max(1e3 / F, 5), 120) * (1 - L) + l * L;
                g - p > f.So &&
                  5 < ++w &&
                  ((F = f.k),
                  (h =
                    h * (1 - F) +
                    (l < x[0] ? m - 1 : l > x[1] ? m + 1 : m) * F),
                  Math.abs(h - m) > 1 - f.vn &&
                    ((F = Math.min(Math.max(Math.round(h), 0), f.n - 1)),
                    F !== m && ((h = m = F), (l = 0.5 * (x[1] - x[0])))),
                  (p = g));
              },
              qg: function (g, F, L, D, G, e) {
                A = !1;
                a(g, F, L, D, G, e, 0);
              },
              stop: function () {
                A = !0;
              },
              oo: function (g) {
                q = g;
                d = 1;
              },
              Ro: function () {
                d = 0;
                k.reset();
              },
              reset: function () {
                u = b.vd[1];
                p = l = -1;
                w = 0;
              },
              Uq: function (g, F, L) {
                L = Math.exp((-y * u) / L);
                return (1 - L) * g + L * F;
              },
              Yp: function () {
                return u;
              },
              Jl: function () {
                return new Promise(function (g) {
                  function F(n) {
                    n = n || Date.now();
                    var z = Math.max(0, n - D);
                    D = n;
                    0 !== G++ && 0 < z && ((L = Math.min(L, z)), ++e);
                    10 >= G
                      ? window.requestAnimationFrame(F)
                      : g(Math.round(1e3 / L));
                  }
                  var L = Infinity,
                    D = 0,
                    G = 0,
                    e = 0;
                  setTimeout(F, 1);
                });
              },
            };
          return k;
        })(),
        hd = (function () {
          function a(I, u) {
            var y = I[0] - 0.5;
            I = I[1] - 0.5;
            var A = u[0] - 0.5;
            u = u[1] - 0.5;
            return y * y + I * I - (A * A + u * u);
          }
          var b = {
              Pi: 4,
              $d: [1.5, 1.5, 2],
              ta: [0.1, 0.1, 0.1],
              kj: 1,
              da: -1,
              Tb: -1,
              Mo: 2,
              sn: 1,
              rg: !0,
              Hl: 0.8,
            },
            d = null,
            f = [],
            l = [],
            p = [],
            w = [0],
            h = [0.5, 0.5, 1],
            m = null,
            q = 0,
            x = [0, 0, 0];
          return {
            m: function (I) {
              d = Object.assign({}, b, I);
              f.splice(0);
              l.splice(0);
              p.splice(0);
              q = 0;
              I = d.$d[0] * d.ta[0];
              var u = d.$d[1] * d.ta[1],
                y = 1 / (1 + d.$d[2] * d.ta[2]),
                A = d.kj * Math.min(d.da, d.Tb),
                k = A / d.da;
              A /= d.Tb;
              var g = 0.5 * d.Hl;
              g *= g;
              for (var F = 0; F < d.Pi; ++F) {
                var L = [];
                l.push(L);
                var D = Math.pow(y, F),
                  G = k * D,
                  e = A * D;
                D = G * d.sn;
                p.push(D);
                var n = G * I,
                  z = e * u;
                G /= 2;
                e /= 2;
                for (
                  var P = 1 + (1 - G - G) / n, B = 1 + (1 - e - e) / z, E = 0;
                  E < B;
                  ++E
                )
                  for (var M = e + E * z, t = M - 0.5, v = 0; v < P; ++v) {
                    var Q = G + v * n,
                      X = Q - 0.5;
                    X * X + t * t > g ||
                      ((Q = [Q, M, D]), f.push(Q), L.push(Q));
                  }
                d.rg && L.sort(a);
                m = f;
              }
              d.rg && f.sort(a);
            },
            get: function (I) {
              var u = m.length;
              if (0 === u) return h;
              for (; I >= w.length; ) w.push(0);
              w[I] >= u && (w[I] = 0);
              var y = m[Math.floor(w[I]) % u];
              w[I] = (w[I] + 1 / d.Mo) % u;
              if (0 === q) return y;
              x[0] = y[0];
              x[1] = y[1];
              x[2] = q;
              return x;
            },
            zq: function (I) {
              I >= w.length || (w[I] = Math.floor(Math.random() * m.length));
            },
            Mq: function (I) {
              q = I;
              if (0 === q) m = f;
              else {
                for (var u = p.length, y = u - 1, A = 0; A < u; ++A)
                  if (p[A] <= I) {
                    y = A;
                    break;
                  }
                m = l[y];
              }
            },
            reset: function () {
              for (var I = f.length / w.length, u = 0; u < w.length; ++u)
                w[u] = Math.floor(u * I);
              q = 0;
              m = f;
            },
          };
        })(),
        Db = (function () {
          function a() {
            d(k + y.Wf);
            g.port.postMessage("DONE");
          }
          function b() {
            G.fd = 0 === y.Ca ? L(d) : L(f);
          }
          function d(B) {
            D.Xb &&
              null !== A &&
              ((B -= k),
              (B = Math.min(Math.max(B, y.Jh[0]), y.Jh[1])),
              (k += B),
              p(),
              e.isEnabled &&
                e.Kc &&
                D.Pa &&
                k - e.If > y.gh &&
                (q(), (e.If = k)),
              A(k));
          }
          function f(B) {
            D.Xb && (G.timeout = setTimeout(d.bind(null, B), y.Ca));
          }
          function l() {
            A = null;
            D.Xb = !1;
            p();
          }
          function p() {
            G.fd && (window.cancelAnimationFrame(G.fd), (G.fd = null));
            G.timeout && (window.clearTimeout(G.timeout), (G.timeout = null));
          }
          function w(B) {
            B && !D.Pa
              ? ((D.Pa = !0),
                F && Ob.Ro(),
                g.port.postMessage("STOP"),
                Ia.Rj(!0),
                b())
              : !B &&
                D.Pa &&
                ((D.Pa = !1),
                F && Ob.oo(1),
                Ia.Rj(!1),
                g.port.postMessage("START"));
          }
          function h(B) {
            B.target.hidden ? z() : n();
          }
          function m(B, E, M) {
            E = B.createShader(E);
            B.shaderSource(E, M);
            B.compileShader(E);
            return E;
          }
          function q() {
            e.Kc = !1;
            var B = e.Xa,
              E = e.Fd,
              M = e.Gd,
              t = e.Da;
            B.uniform1f(e.ki, Math.random());
            e.Yb ? E.beginQueryEXT(t, M) : B.beginQuery(t, M);
            B.drawElements(B.POINTS, 1, B.UNSIGNED_SHORT, 0);
            e.Yb ? E.endQueryEXT(t) : B.endQuery(t);
            Ia.flush();
            I()
              .then(function (v) {
                0 === v || isNaN(v)
                  ? ((e.isEnabled = !1),
                    console.log(
                      "WARNING in benchmark_GPUClock: WebGL timer queries is not working properly. timeElapsedNs =",
                      v
                    ))
                  : ((v = (y.hk * y.fh * 1e3) / v),
                    (e.xe = (e.xe + 1) % y.sc),
                    (e.Jf[e.xe] = v),
                    ++e.Ei > y.sc &&
                      (e.Nd.set(e.Jf),
                      e.Nd.sort(function (Q, X) {
                        return Q - X;
                      }),
                      (v = e.Nd[Math.floor(y.sc / 2)]),
                      (e.yd = Math.max(e.yd, v)),
                      y.eh(v / e.yd)),
                    (e.Kc = !0));
              })
              .catch(function () {
                e.Kc = !0;
              });
          }
          function x(B) {
            var E = e.Xa,
              M = e.Fd,
              t = e.Gd;
            t = e.Yb
              ? M.Sp(t, M.QUERY_RESULT_AVAILABLE_EXT)
              : E.getQueryParameter(t, E.QUERY_RESULT_AVAILABLE);
            E = E.getParameter(M.GPU_DISJOINT_EXT);
            t ? B(!E) : setTimeout(x.bind(null, B), 0.1);
          }
          function I() {
            return new Promise(function (B, E) {
              x(function (M) {
                if (M) {
                  M = e.Xa;
                  var t = e.Fd,
                    v = e.Gd;
                  M = e.Yb
                    ? t.getQueryObjectEXT(v, t.QUERY_RESULT_EXT)
                    : M.getQueryParameter(v, M.QUERY_RESULT);
                  B(M);
                } else E();
              });
            });
          }
          var u = {
              vi: !0,
              Jh: [1, 200],
              Wf: 20,
              Ca: 0,
              fh: 50,
              hk: 240,
              gh: 3e3,
              sc: 3,
              eh: null,
            },
            y = null,
            A = null,
            k = 0,
            g = null,
            F = !1,
            L = null,
            D = { Oa: !1, Pa: !0, Hf: !1, Ff: !1, Ef: !1, Xb: !1 },
            G = { fd: null, timeout: null },
            e = {
              isEnabled: !1,
              Kc: !1,
              Xa: null,
              Fd: null,
              Gd: null,
              Da: null,
              ki: null,
              Yb: !0,
              If: 0,
              Ei: 0,
              Jf: null,
              Nd: null,
              xe: 0,
              yd: 0,
            },
            n = w.bind(null, !0),
            z = w.bind(null, !1),
            P = {
              m: function (B) {
                y = Object.assign(u, B);
                Object.assign(D, { Pa: !0, Oa: !0, Xb: !1 });
                L =
                  window.requestPostAnimationFrame ||
                  window.requestAnimationFrame;
                if (null !== y.eh) {
                  B = document.createElement("canvas");
                  B.setAttribute("width", "1");
                  B.setAttribute("height", "1");
                  var E = { antialias: !1 };
                  B = B.getContext("webgl2", E) || B.getContext("webgl", E);
                  if (
                    (E =
                      B.getExtension("EXT_disjoint_timer_query") ||
                      B.getExtension("EXT_disjoint_timer_query_webgl2"))
                  ) {
                    e.Xa = B;
                    e.Fd = E;
                    e.isEnabled = !0;
                    e.Yb = E.beginQueryEXT ? !0 : !1;
                    var M = m(
                        B,
                        B.VERTEX_SHADER,
                        "attribute vec4 a0;void main(){gl_Position=a0;}"
                      ),
                      t = m(
                        B,
                        B.FRAGMENT_SHADER,
                        "precision lowp float;uniform float u39;void main(){vec4 a=u39*vec4(1.,2.,3.,4.);for(int b=0;b<666;b+=1)a=cos(a);gl_FragColor=a;}".replace(
                          "666",
                          y.fh.toString()
                        )
                      ),
                      v = B.createProgram();
                    B.attachShader(v, M);
                    B.attachShader(v, t);
                    B.linkProgram(v);
                    M = B.getAttribLocation(v, "a0");
                    e.ki = B.getUniformLocation(v, "u39");
                    B.useProgram(v);
                    B.enableVertexAttribArray(M);
                    v = B.createBuffer();
                    B.bindBuffer(B.ARRAY_BUFFER, v);
                    B.bufferData(
                      B.ARRAY_BUFFER,
                      new Float32Array([0.5, 0.5, 0, 1]),
                      B.STATIC_DRAW
                    );
                    B.vertexAttribPointer(M, 4, B.FLOAT, !1, 16, 0);
                    v = B.createBuffer();
                    B.bindBuffer(B.ELEMENT_ARRAY_BUFFER, v);
                    B.bufferData(
                      B.ELEMENT_ARRAY_BUFFER,
                      new Uint16Array([0]),
                      B.STATIC_DRAW
                    );
                    B.disable(B.DEPTH_TEST);
                    B.disable(B.DITHER);
                    B.disable(B.STENCIL_TEST);
                    B.viewport(0, 0, 1, 1);
                    v = e.Yb ? E.createQueryEXT() : B.createQuery();
                    e.Gd = v;
                    e.Da = E.TIME_ELAPSED_EXT || B.TIME_ELAPSED;
                    e.If = -y.gh;
                    e.Jf = new Float32Array(y.sc);
                    e.Nd = new Float32Array(y.sc);
                    e.yd = 0;
                    e.xe = 0;
                    e.Ei = 0;
                    e.Kc = !0;
                  }
                }
                if (y.vi) {
                  B = !1;
                  try {
                    if ("undefined" === typeof SharedWorker) {
                      var Q = URL.createObjectURL(
                          new Blob(
                            [
                              "let handler = null;\n      self.addEventListener('message', function(e){\n        if (handler !== null){\n          clearTimeout(handler);\n          handler = null;\n        }\n        switch (e.data) {\n          case 'START':\n          case 'DONE':\n            handler = setTimeout(function(){\n              self.postMessage('TICK');\n            }, " +
                                y.Wf.toString() +
                                ");\n            break;\n          case 'STOP':\n            break;\n        };\n      }, false);",
                            ],
                            { type: "text/javascript" }
                          )
                        ),
                        X = new Worker(Q);
                      X.addEventListener("message", a);
                      g = { bj: X, port: X };
                      D.Hf = !0;
                    } else {
                      var U = URL.createObjectURL(
                          new Blob(
                            [
                              "let handler = null;\n      onconnect = function(e) {\n        const port = e.ports[0];\n        port.addEventListener('message', function(e) {\n          \n          if (handler !== null){\n            clearTimeout(handler);\n            handler = null;\n          }\n          switch (e.data) {\n            case 'START':\n            case 'DONE':\n              handler = setTimeout(function(){\n                port.postMessage('TICK');\n              }, " +
                                y.Wf.toString() +
                                ");\n              break;\n            case 'STOP':\n              break;\n          };\n          \n        });\n        \n        port.start();\n      } // end onconnect()",
                            ],
                            { type: "text/javascript" }
                          )
                        ),
                        ia = new SharedWorker(U);
                      ia.port.start();
                      ia.port.addEventListener("message", a);
                      g = { bj: ia, port: ia.port };
                      D.Ff = !0;
                    }
                    B = !0;
                  } catch (O) {}
                  B &&
                    ("onvisibilitychange" in document
                      ? document.addEventListener("visibilitychange", h)
                      : (window.addEventListener("blur", z),
                        window.addEventListener("focus", n)),
                    window.addEventListener("pagehide", z),
                    window.addEventListener("pageshow", n),
                    (D.Ef = !0));
                }
                F = "undefined" !== typeof Ob;
              },
              A: function () {
                l();
                D.Ef &&
                  ("onvisibilitychange" in document
                    ? document.removeEventListener("visibilitychange", h)
                    : (window.removeEventListener("blur", z),
                      window.removeEventListener("focus", n)),
                  window.removeEventListener("pagehide", z),
                  window.removeEventListener("pageshow", n),
                  (D.Ef = !1));
                D.Ff
                  ? (g.port.close(), (D.Ff = !1))
                  : D.Hf && (g.bj.terminate(), (D.Hf = !1));
                Object.assign(D, { Pa: !0, Oa: !1, Xb: !1 });
                A = null;
              },
              uq: function () {
                return D.Pa;
              },
              update: function (B) {
                Object.assign(y, B);
              },
              qg: function (B) {
                D.Oa || P.m({});
                p();
                D.Xb = !0;
                A = B;
                D.Pa && b();
              },
              stop: l,
            };
          return P;
        })(),
        Jc = {
          mf: function () {
            return Date.now();
          },
          Vp: function () {
            return performance.now();
          },
        },
        Id = (function () {
          var a = { Jm: !0, isLinear: !0, Xf: [4, 11] };
          return {
            Qp: function (b, d, f) {
              return d.isDetected
                ? Math.floor(d.s * b)
                : ((b = Math.floor(Math.log2(b / 4))),
                  (b = Math.min(Math.max(b, 4), 9)),
                  Math.max(f, Math.pow(2, b)));
            },
            instance: function (b) {
              var d = Object.assign({}, a, b),
                f = [],
                l = null,
                p = -1,
                w = null,
                h = !1;
              for (b = d.Xf[0]; b <= d.Xf[1]; ++b) f[b] = null;
              return {
                J: function (m, q) {
                  q !== p &&
                    (l && l.remove(),
                    (l = ba.instance({
                      isLinear: d.isLinear,
                      isPot: !0,
                      width: q,
                    })));
                  if ((h = d.Jm && q < 0.5 * m)) {
                    m = Math.floor(Math.log2(m));
                    var x = d.Xf;
                    x = m = Math.min(Math.max(m, x[0]), x[1]);
                    if (!f[x]) {
                      var I = ba.instance({
                        isPot: !0,
                        isMipmap: !0,
                        xi: !0,
                        width: Math.pow(2, x),
                      });
                      f[x] = { V: I, Ni: -1 };
                    }
                    m = f[m];
                    w = m.V;
                    m.Ni !== q &&
                      ((x = Math.log2(q)),
                      w.h(0),
                      w.zj(x),
                      ba.aa(0),
                      (m.Ni = q));
                  } else w = l;
                  p = q;
                  w.J();
                },
                h: function (m) {
                  w.h(m);
                  h && w.Ec();
                },
                ya: function (m) {
                  w.ya(m);
                },
                remove: function () {
                  l && l.remove();
                  f.forEach(function (m) {
                    m && m.V.remove();
                  });
                },
              };
            },
          };
        })(),
        Eb = (function () {
          function a(T) {
            switch (n) {
              case e.movePinch:
                var ta = -T.deltaY;
                0 === z && k("pinch", -1, 0.001 * ta, null);
            }
            T.deltaY;
            T.preventDefault();
          }
          function b(T) {
            if (-1 !== z)
              switch (n) {
                case e.swipe:
                  if (1 !== z) break;
                  m();
                  x(T, B);
                  var ta = B[0] - P[0];
                  l(ta);
                  T = ta / ((20 * L.offsetWidth) / 100);
                  k("swipeMove", Math.min(Math.max(T, -1), 1), T, null);
                  break;
                case e.movePinch:
                  if (2 === z || 3 === z) {
                    x(T, B);
                    ta = B[0] - P[0];
                    var Ha = B[1] - P[1];
                    2 === z
                      ? ((N += Math.sqrt(ta * ta + Ha * Ha)),
                        10 > N
                          ? ((P[0] = B[0]), (P[1] = B[1]))
                          : (ma ||
                              ((ma = !0), k("moveStart", null, null, null)),
                            (ca[0] = ta),
                            (ca[1] = Ha),
                            (M[0] = ta - E[0]),
                            (M[1] = Ha - E[1]),
                            k("move", ca, M, null),
                            (E[0] = ca[0]),
                            (E[1] = ca[1])))
                      : 3 === z &&
                        ((T = q(T) / fa),
                        k("pinch", T, T - ya, null),
                        (ya = T));
                  }
              }
          }
          function d(T) {
            if (-1 !== z)
              switch (n) {
                case e.swipe:
                  if (1 !== z) break;
                  m();
                  x(T, B);
                  T = B[0] - P[0];
                  var ta = 0 > T;
                  (T = 20 < (100 * Math.abs(T)) / L.offsetWidth) && ta
                    ? k("swipeLeft", t, null, null)
                    : T && !ta && k("swipeRight", t, null, null);
                  var Ha = function () {
                    setTimeout(function () {
                      h();
                      z = 0;
                      k("swipeEnd", null, null, null);
                    }, 202);
                  };
                  T
                    ? ((T = function () {
                        var bb = (ta ? -1 : 1) * L.width,
                          Da = ((ta ? 1 : -1) * bb) / L.width;
                        t.style.transitionDuration = (400).toString() + "ms";
                        t.style.left = (ia[0] + bb).toString() + "px";
                        t.style.top = ia[1].toString() + "px";
                        t.style.transform =
                          "rotate( " + Da.toString() + "rad )";
                        Ha();
                      }),
                      U ? T() : (O = T))
                    : ((t.style.transitionDuration = (200).toString() + "ms"),
                      (t.style.opacity = "0"),
                      (t.style.left = ia[0].toString() + "px"),
                      (t.style.top = ia[1].toString() + "px"),
                      (t.style.transform = ""),
                      Ha());
                  z = -1;
                  break;
                case e.movePinch:
                  if (2 === z || 3 === z)
                    z === z.move
                      ? k("moveEnd", null, null, null)
                      : 3 === z && k("pinchEnd", null, null, null),
                      (z = 0);
              }
          }
          function f(T) {
            T.preventDefault();
            if (-1 !== z)
              switch (n) {
                case e.swipe:
                  if (0 !== z) break;
                  m();
                  z = 1;
                  ka = setTimeout(function () {
                    h();
                    ka = null;
                    1 === z && ((z = 0), k("swipeEnd", null, null, null));
                  }, 1e3);
                  p();
                  k("swipeStart", null, null, null);
                  k("swipeGetCanvas", t, Q, v);
                  x(T, P);
                  break;
                case e.movePinch:
                  0 !== z
                    ? 2 !== z ||
                      ma ||
                      (void 0 === T.changedTouches && void 0 === T.touches) ||
                      ((fa = q(T)),
                      20 < fa &&
                        ((z = 3), (ya = 1), k("pinchStart", null, null, null)))
                    : 3 !== z &&
                      ((ma = !1),
                      x(T, P),
                      (E[0] = 0),
                      (E[1] = 0),
                      (z = 2),
                      (N = 0));
              }
          }
          function l(T) {
            var ta = 0 > T;
            t.style.left = ia[0] + T + "px";
            t.style.transformOrigin = ta ? H : Qa;
            t.style.transform =
              "rotate( " + (((ta ? 1 : -1) * T) / L.width).toString() + "rad )";
          }
          function p() {
            U = !1;
            var T = L.getBoundingClientRect();
            ia[0] = T.left;
            ia[1] = T.top;
            t.width = Math.round(L.width / 4);
            t.height = Math.round(L.height / 4);
            v.width = t.width;
            v.height = t.height;
            t.style.width = L.offsetWidth + "px";
            t.style.height = L.offsetHeight + "px";
            t.style.left = ia[0] + "px";
            t.style.top = ia[1] + "px";
            setTimeout(w, 0);
          }
          function w() {
            Q.drawImage(L, 0, 0, t.width, t.height);
            X.drawImage(t, 0, 0);
            U = !0;
            document.body.appendChild(t);
            O && (O(), (O = !1));
          }
          function h() {
            t.style.transitionDuration = "0ms";
            t.style.opacity = "1";
            t.style.transform = "";
            U && (document.body.removeChild(t), (U = !1));
          }
          function m() {
            ka && (window.clearTimeout(ka), (ka = null));
          }
          function q(T) {
            I(T, qa, 0);
            I(T, oa, 1);
            return Math.sqrt(qa[0] * qa[0] + oa[0] * oa[0]);
          }
          function x(T, ta) {
            void 0 !== T.changedTouches || void 0 !== T.touches
              ? I(T, ta, 0)
              : ((ta[0] = T.pageX), (ta[1] = T.pageY));
          }
          function I(T, ta, Ha) {
            T.touches.length > Ha
              ? ((ta[0] = T.touches[Ha].pageX), (ta[1] = T.touches[Ha].pageY))
              : ((ta[0] = T.changedTouches[Ha].pageX),
                (ta[1] = T.changedTouches[Ha].pageY));
          }
          function u() {
            G.forEach(function (T) {
              L.removeEventListener(T.type, T.sb, !1);
            });
            return G.splice(0, G.length);
          }
          function y(T) {
            T.forEach(function (ta) {
              A(ta.type, ta.sb);
            });
          }
          function A(T, ta) {
            L.removeEventListener(T, ta, !1);
            t.removeEventListener(T, ta, !1);
            L.addEventListener(T, ta, !1);
            t.addEventListener(T, ta, !1);
            0 ===
              G.filter(function (Ha) {
                return Ha.type === T && Ha.sb === ta;
              }).length && G.push({ type: T, sb: ta });
          }
          function k(T, ta, Ha, bb) {
            D[T].forEach(function (Da) {
              Da.sb(ta, Ha, bb);
            });
          }
          function g(T) {
            return T[0] + "% " + (100 - T[1]).toString() + "%";
          }
          var F = !1,
            L = null,
            D = {
              swipeStart: [],
              swipeEnd: [],
              swipeLeft: [],
              swipeRight: [],
              swipeMove: [],
              swipeGetCanvas: [],
              pinch: [],
              pinchStart: [],
              pinchEnd: [],
              move: [],
              moveStart: [],
              moveEnd: [],
            },
            G = [],
            e = { idle: 0, swipe: 1, movePinch: 2 },
            n = e.idle,
            z = 0,
            P = [0, 0],
            B = [0, 0],
            E = [0, 0],
            M = [0, 0],
            t = document.createElement("canvas"),
            v = document.createElement("canvas"),
            Q = t.getContext("2d"),
            X = v.getContext("2d");
          t.style.position = "fixed";
          t.style.zIndex = "800";
          t.style.cursor = "move";
          t.style.pointerEvents = "none";
          t.className = "swipeImage";
          t.setAttribute("draggable", !1);
          var U = !1,
            ia = [0, 0],
            O = null,
            ka = null,
            Qa = g([50, 100]),
            H = g([50, 0]),
            r = null,
            N = 0,
            ca = [0, 0],
            fa = 0,
            ma = !1,
            ya = 1,
            qa = [0, 0],
            oa = [0, 0],
            la = {
              init: function (T) {
                if (F) la.switch_canvas(T.sa);
                else
                  return (
                    (L = T.sa),
                    A("mousedown", f),
                    A("mouseup", d),
                    A("mouseout", d),
                    A("mousemove", b),
                    A("mousemove", b),
                    A("wheel", a),
                    A("touchstart", f),
                    A("touchend", d),
                    A("touchmove", b),
                    (F = !0),
                    la
                  );
              },
              switch_canvas: function (T) {
                if (!F) la.init({ sa: T });
                else if (L !== T) {
                  var ta = u();
                  L = T;
                  y(ta);
                  for (var Ha in D)
                    for (T = D[Ha], ta = T.length - 1; 0 <= ta; --ta)
                      T[ta].Mn && T.splice(ta, 1);
                }
              },
              get_mode: function () {
                for (var T in e) if (e[T] === n) return T;
                return !1;
              },
              switch_mode: function (T) {
                F &&
                  "undefined" !== typeof e[T] &&
                  ((T = e[T]), n !== T && (m(), (n = T), (z = 0)));
              },
              add_listener: function (T, ta, Ha) {
                D[T].push({ sb: ta, Mn: "undefined" === typeof Ha ? !1 : Ha });
                return la;
              },
              remove_listener: function (T) {
                D[T].splice(0, D[T].length);
                return la;
              },
              animate_swipe: function (T, ta) {
                r && (clearInterval(r), (r = null));
                p();
                var Ha = (L.width / (ta / 1e3)) * ("left" === T ? -1 : 1),
                  bb = 0,
                  Da,
                  Ta = Date.now();
                r = setInterval(function () {
                  r &&
                    ((Da = Date.now()),
                    (bb += ((Da - Ta) / 1e3) * Ha),
                    l(bb),
                    (Ta = Da),
                    Math.abs(bb) > 0.75 * L.width &&
                      r &&
                      (clearInterval(r), (r = null), h()));
                }, 16);
              },
            };
          return la;
        })();
      window.CanvasListeners = Eb;
      var da = { VERSION: "4.6.2", ready: !1, isBusy: !1 },
        cb = {
          idealWidth: 800,
          idealHeight: 600,
          minWidth: 480,
          maxWidth: 1280,
          minHeight: 480,
          maxHeight: 1280,
          FOVdesktop: 60,
          rotate: 0,
          FOVmobile: 60,
          FOVforced: 0,
          Ee: 10,
          De: 8e3,
        },
        J = Object.assign(
          {},
          {
            Lc: !0,
            Wd: "models3D",
            Vd: "materials",
            Po: "tweakers",
            neuralNetworkPath: "built/jeefitNNC_66_0.json",
            neuralNetworkVersion: "66_0",
            ea: "",
            wa: "",
            ad: "",
            Ca: 0,
            rk: 20,
            width: 1024,
            height: 1024,
            yi: !0,
            un: [2, 3.5],
            ij: 300,
            bd: [1, 6],
            scanOverlapFactors: [2, 2, 3],
            scanNScaleLevels: 2,
            scanScale0Factor: 0.7,
            ta: [0.2, 0.2, 0.3],
            oc: [
              [0.8, 0.5],
              [0.8, 0.5],
              [1, 1],
            ],
            No: 30,
            ol: 1,
            En: [0.4, 0.7],
            Dn: 1,
            Oo: [0.01, 0.035],
            Vn: [0.003, 0.007],
            Mg: [0, 0.6],
            Ml: 0.2,
            ab: [0.698111, 1.047166, 0.122169],
            Pj: [-0.1, 0, 0],
            ce: [0, -62, 8],
            zn: 1.03,
            Ha: [0, -60, 0],
            $f: 50,
            ag: 20,
            Cc: 0.4,
            hf: 73,
            He: [0.035, 1],
            pk: [4, 1],
            Vk: [0, 0.5],
            Xn: 0.15,
            Un: 1,
            Qn: [1, 4.5],
            cp: 20,
            Pp: !1,
            Gc: 145,
            zf: -18,
            xf: 20,
            yf: 3,
            Oc: [-110, 0],
            jc: 1,
            Ej: 0.4,
            Fj: 3,
            le: [0, 0, 0],
            kc: [1.1, 1],
            od: 0,
            Ye: 0.95,
            Xe: 90,
            We: 50,
            gd: 25,
            Mb: 0.1,
            vf: !0,
            Sd: !0,
            Rf: "images/masks/target.jpg",
            Sf: !1,
            Rd: [1 / 255, 175 / 255, 236 / 255, 0],
            Td: -0.001,
            Qf: 3.14,
            Le: 0,
            Ke: "images/masks/burka.png",
            Ie: Math.PI - Math.PI / 4,
            Ve: Math.PI / 4,
            pg: [0.3, 0.2, 0.1],
            Zb: !0,
            Gi: [700, 90],
            $m: [0.2, 0.04],
            ep: "images/backgrounds/viewer3D.png",
            dh: [0, 0, 0],
            bh: [0, 15, 60],
            Be: 0.3,
            mp: 50,
            ip: rd ? Ka : !1,
            jp: rd ? Ka : !1,
            lp: 1e3,
            op: 1e3,
            kp: 40,
            hp: [0, 0, -400],
            Ji: 0.1,
            dn: 0.5,
            Ki: [0.5, 1.5],
            Ud: 30,
            cn: !0,
          }
        );
      W.zh = !0;
      W.Ah = !0;
      W.yh = !1;
      W.Qa = !0;
      var db = {
        ee: 3.5,
        Db: "images/debug/picsou.png",
        Tc: 45,
        Of: 0.785,
        Pf: 0.3925,
        Pd: 5,
        Od: 2,
        Nf: 0,
        Mf: 0,
        fp: "images/backgrounds/bg1.jpg",
        gp: "images/backgrounds/bg1_light.jpg",
        ck: 1,
        dk: 2,
      };
      J.fx = [4, 50];
      J.Oc = [-110, 0];
      J.Ej = 0.25;
      J.Fj = 3;
      J.le = [0, -2, 20];
      J.kc = [0.95, 1];
      W.Rc = 2.1289;
      W.jg = 1;
      db.ee = 2.5858;
      db.Of = 0.4388;
      db.Pf = 0.118;
      db.Db = "images/debug/hdri2.png";
      db.Tc = 180;
      db.sg = 0.8065;
      db.Pd = 5.3887;
      db.Od = 0.5351;
      db.Nf = -0.3019;
      db.Mf = 0;
      db.ck = 3.5288;
      db.dk = 6.2168;
      var jd = {
          element: null,
          Lh: null,
          Md: !1,
          wh: null,
          V: null,
          Sg: null,
          deviceId: -1,
          jf: -1,
          ud: 0,
          $i: null,
          Ae: -1,
        },
        Fa = Object.assign({}, jd),
        Rb = null,
        Bc = [],
        Dc = [],
        Nc = null,
        Sc = null,
        Oc = null,
        ab = null,
        sd = J.un,
        td = window.devicePixelRatio || 1;
      var Ac = { Ll: Math.max(sd[0] / td, 1), ff: Math.min(td, sd[1]) };
      var gb = null;
      da.onLoad = function (a) {
        da.ready ? a() : Bc.push(a);
      };
      da.onHalfLoad = function (a) {
        da.load_model ? a() : Dc.push(a);
      };
      da.onWebcamAsk = function (a) {
        Nc = a;
      };
      da.onContextLost = function (a) {
        Sc = a;
      };
      da.onWebcamGet = function (a) {
        Oc = a;
      };
      da.get_onHalfLoadCallstack = function () {
        return Dc;
      };
      da.set_size = function (a, b, d) {
        d = d ? Ac.ff : 1;
        J.width = a * d;
        J.height = b * d;
      };
      da.get_videoDevices = function (a) {
        ed(a);
      };
      da.set_videoDevice = function (a) {
        Fa.deviceId = a;
      };
      da.set_videoSizes = function (a, b, d, f, l, p) {
        cb.idealWidth = a;
        cb.idealHeight = b;
        cb.minWidth = d;
        cb.maxWidth = f;
        cb.minHeight = l;
        cb.maxHeight = p;
      };
      da.set_loading = function (a, b, d) {
        a && ((J.Sf = !0), (J.Rf = a));
        "number" === typeof b && ((a = new dc(b)), (J.Rd = [a.r, a.Z, a.b, 0]));
        "number" === typeof d && (J.Td = d);
      };
      da.set_settings = function (a, b, d) {
        a && Object.assign(J, a);
        b && Object.assign(cb, b);
        d && Object.assign(db, d);
      };
      da.get_size = function () {
        return { width: J.width, height: J.height };
      };
      da.get_cv = function () {
        return mb.tb();
      };
      da.set_NNCPath = function (a) {
        J.ad = a;
      };
      da.set_materialsPath = function (a) {
        J.Vd = a;
      };
      da.set_modelsPath = function (a) {
        J.Wd = a;
      };
      da.destroy = function () {
        return gb ? gb.A() : Promise.resolve();
      };
      da.update_lightSettings = function (a) {
        a = Object.assign(
          {
            screenTextureURL: null,
            screenLuminosity: -1,
            lightDirFactor: -1,
            lightAmbFactor: -1,
            screenWidthAngle: -1,
          },
          a
        );
        0 <= a.lightDirFactor && (db.Pd = a.lightDirFactor);
        0 <= a.lightAmbFactor && (db.Od = a.lightAmbFactor);
        0 <= a.screenLuminosity && (db.ee = a.screenLuminosity);
        0 <= a.screenWidthAngle && (db.Tc = a.screenWidthAngle);
        a.screenTextureURL && (db.Db = a.screenTextureURL);
        da.ready && (gb.Lj(), za.La.oh(Fa.V));
      };
      da.preFetch = function (a, b) {
        b = b || [];
        b.push(id(a));
        b.forEach(Kd);
      };
      da.check_isMobile = mc;
      da.init2 = function (a) {
        var b = Object.assign(
          {
            basePath: null,
            modelsPath: null,
            materialsPath: null,
            materialTextureBasePath: null,
            NNCPath: null,
            cv: null,
            isRequestCamera: !0,
            width: 512,
            height: 512,
            isMirror: !0,
            isApplyOverSampling: !1,
            scanOverlapFactors: null,
            scanNScaleLevels: null,
            scanScale0Factor: null,
            callbackReady: null,
          },
          a
        );
        J.Lc = b.isRequestCamera;
        da.set_size(b.width, b.height, b.isApplyOverSampling);
        da.update_lightSettings(a);
        b.modelsPath && (J.Wd = b.modelsPath);
        b.materialsPath && (J.Vd = b.materialsPath);
        b.materialTextureBasePath && (W.Mi = b.materialTextureBasePath);
        b.NNCPath && (J.ad = b.NNCPath);
        J.scanOverlapFactors = b.scanOverlapFactors || J.scanOverlapFactors;
        J.scanNScaleLevels = b.scanNScaleLevels || J.scanNScaleLevels;
        J.scanScale0Factor = b.scanScale0Factor || J.scanScale0Factor;
        J.yi = b.isMirror;
        return new Promise(function (d, f) {
          da.onHalfLoad(d);
          da.init(
            b.basePath,
            function () {
              b.callbackReady && b.callbackReady();
            },
            f,
            b.cv
          );
        });
      };
      da.init = function (a, b, d, f) {
        gb = Gd();
        Rb = d
          ? function (l, p) {
              d(l, p);
              Rb = null;
            }
          : function () {};
        a && (J.ea = a);
        b && Bc.push(b);
        gb.Lj();
        a = gb.gm();
        return mb.m({
          Ue: "jeefitCanvas",
          sa: f,
          width: a.width,
          height: a.height,
          debug: !1,
          dg: function () {
            Sc && Sc();
          },
          premultipliedAlpha: !0,
        })
          ? J.Lc
            ? kd()
            : Ld()
          : (Rb && Rb("GL_INCOMPATIBLE", "Cannot init Context"), !1);
      };
      da.request_cameraVideoStream = function () {
        return kd().then(function () {
          gb.Nl(J.width, J.height, 0);
        });
      };
      window.ARLOOK = da;
      var gd = (function () {
          function a() {
            Ea.aa();
            c.viewport(0, 0, 1, 1);
            aa.set("s74");
            f.h(0);
            Y.l(!1);
            c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, p);
            b(0 < p[0]);
          }
          var b = null,
            d = !1,
            f = null,
            l = !1,
            p = null,
            w = {
              m: function (h) {
                if (l) return !1;
                f = h;
                aa.uc([
                  {
                    id: "s74",
                    name: "_",
                    g: "uniform sampler2D u41;const vec2 e=vec2(.16,.5);void main(){vec4 a=texture2D(u41,e);float b=step(1.99,a.r);gl_FragColor=vec4(b,0.,0.,1.);}",
                    i: ["u41"],
                    precision: "lowp",
                  },
                ]);
                aa.j("s74", [{ type: "1i", name: "u41", value: 0 }]);
                p = new Uint8Array(4);
                return (l = !0);
              },
              start: function (h, m) {
                w.stop();
                b = m;
                d = window.setInterval(a, h);
              },
              stop: function () {
                d && (window.clearInterval(a), (d = !1));
              },
            };
          return w;
        })(),
        Tc = {};
      dc.prototype = {
        constructor: dc,
        r: 1,
        Z: 1,
        b: 1,
        set: function (a) {
          a instanceof dc
            ? this.N(a)
            : "number" === typeof a
            ? md(this, a)
            : "string" === typeof a && Md(this, a);
          return this;
        },
        $n: (function () {
          function a(b, d, f) {
            0 > f && (f += 1);
            1 < f && --f;
            return f < 1 / 6
              ? b + 6 * (d - b) * f
              : 0.5 > f
              ? d
              : f < 2 / 3
              ? b + 6 * (d - b) * (2 / 3 - f)
              : b;
          }
          return function (b, d, f) {
            b = Tc.Math.Rp(b, 1);
            d = Tc.Math.Pe(d, 0, 1);
            f = Tc.Math.Pe(f, 0, 1);
            0 === d
              ? (this.r = this.Z = this.b = f)
              : ((d = 0.5 >= f ? f * (1 + d) : f + d - f * d),
                (f = 2 * f - d),
                (this.r = a(f, d, b + 1 / 3)),
                (this.Z = a(f, d, b)),
                (this.b = a(f, d, b - 1 / 3)));
            return this;
          };
        })(),
        clone: function () {
          return new this.constructor(this.r, this.Z, this.b);
        },
        N: function (a) {
          this.r = a.r;
          this.Z = a.Z;
          this.b = a.b;
          return this;
        },
        add: function (a) {
          this.r += a.r;
          this.Z += a.Z;
          this.b += a.b;
          return this;
        },
        multiply: function (a) {
          this.r *= a.r;
          this.Z *= a.Z;
          this.b *= a.b;
          return this;
        },
        Fa: function (a) {
          this.r *= a;
          this.Z *= a;
          this.b *= a;
          return this;
        },
        rb: function (a, b) {
          void 0 === b && (b = 0);
          this.r = a[b];
          this.Z = a[b + 1];
          this.b = a[b + 2];
          return this;
        },
      };
      var Nd = {};
      Ec.prototype = {
        constructor: Ec,
        get x() {
          return this.F;
        },
        set x(a) {
          this.F = a;
        },
        get y() {
          return this.G;
        },
        set y(a) {
          this.G = a;
        },
        get z() {
          return this.H;
        },
        set z(a) {
          this.H = a;
        },
        get w() {
          return this.T;
        },
        set w(a) {
          this.T = a;
        },
        set: function (a, b, d, f) {
          this.F = a;
          this.G = b;
          this.H = d;
          this.T = f;
          return this;
        },
        clone: function () {
          return new this.constructor(this.F, this.G, this.H, this.T);
        },
        N: function (a) {
          this.F = a.x;
          this.G = a.y;
          this.H = a.z;
          this.T = a.w;
          return this;
        },
        inverse: function () {
          this.F *= -1;
          this.G *= -1;
          this.H *= -1;
          this.normalize();
          return this;
        },
        qd: function (a) {
          return this.F * a.F + this.G * a.G + this.H * a.H + this.T * a.T;
        },
        Kf: function () {
          return (
            this.F * this.F +
            this.G * this.G +
            this.H * this.H +
            this.T * this.T
          );
        },
        length: function () {
          return Math.sqrt(
            this.F * this.F +
              this.G * this.G +
              this.H * this.H +
              this.T * this.T
          );
        },
        normalize: function () {
          var a = this.length();
          0 === a
            ? ((this.H = this.G = this.F = 0), (this.T = 1))
            : ((a = 1 / a),
              (this.F *= a),
              (this.G *= a),
              (this.H *= a),
              (this.T *= a));
          return this;
        },
        multiply: function (a, b) {
          return void 0 !== b
            ? (console.warn(
                "JETHREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."
              ),
              nd(this, a, b))
            : nd(this, this, a);
        },
        rb: function (a, b) {
          void 0 === b && (b = 0);
          this.F = a[b];
          this.G = a[b + 1];
          this.H = a[b + 2];
          this.T = a[b + 3];
          return this;
        },
      };
      ec.prototype = {
        constructor: ec,
        get width() {
          return this.x;
        },
        set width(a) {
          this.x = a;
        },
        get height() {
          return this.y;
        },
        set height(a) {
          this.y = a;
        },
        set: function (a, b) {
          this.x = a;
          this.y = b;
          return this;
        },
        nj: function (a) {
          this.x = a;
          return this;
        },
        oj: function (a) {
          this.y = a;
          return this;
        },
        clone: function () {
          return new this.constructor(this.x, this.y);
        },
        N: function (a) {
          this.x = a.x;
          this.y = a.y;
          return this;
        },
        add: function (a, b) {
          if (void 0 !== b)
            return (
              console.warn(
                "JETHREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
              ),
              this.dd(a, b)
            );
          this.x += a.x;
          this.y += a.y;
          return this;
        },
        dd: function (a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          return this;
        },
        sub: function (a, b) {
          if (void 0 !== b)
            return (
              console.warn(
                "JETHREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
              ),
              this.gb(a, b)
            );
          this.x -= a.x;
          this.y -= a.y;
          return this;
        },
        gb: function (a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          return this;
        },
        multiply: function (a) {
          this.x *= a.x;
          this.y *= a.y;
          return this;
        },
        Fa: function (a) {
          isFinite(a) ? ((this.x *= a), (this.y *= a)) : (this.y = this.x = 0);
          return this;
        },
        af: function (a) {
          return this.Fa(1 / a);
        },
        min: function (a) {
          this.x = Math.min(this.x, a.x);
          this.y = Math.min(this.y, a.y);
          return this;
        },
        max: function (a) {
          this.x = Math.max(this.x, a.x);
          this.y = Math.max(this.y, a.y);
          return this;
        },
        Pe: function (a, b) {
          this.x = Math.max(a.x, Math.min(b.x, this.x));
          this.y = Math.max(a.y, Math.min(b.y, this.y));
          return this;
        },
        floor: function () {
          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          return this;
        },
        ceil: function () {
          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          return this;
        },
        round: function () {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
        },
        qd: function (a) {
          return this.x * a.x + this.y * a.y;
        },
        Kf: function () {
          return this.x * this.x + this.y * this.y;
        },
        length: function () {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        normalize: function () {
          return this.af(this.length());
        },
        rb: function (a, b) {
          void 0 === b && (b = 0);
          this.x = a[b];
          this.y = a[b + 1];
          return this;
        },
      };
      Za.prototype = {
        constructor: Za,
        set: function (a, b, d) {
          this.x = a;
          this.y = b;
          this.z = d;
          return this;
        },
        nj: function (a) {
          this.x = a;
          return this;
        },
        oj: function (a) {
          this.y = a;
          return this;
        },
        clone: function () {
          return new this.constructor(this.x, this.y, this.z);
        },
        N: function (a) {
          this.x = a.x;
          this.y = a.y;
          this.z = a.z;
          return this;
        },
        add: function (a, b) {
          if (void 0 !== b)
            return (
              console.warn(
                "JETHREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
              ),
              this.dd(a, b)
            );
          this.x += a.x;
          this.y += a.y;
          this.z += a.z;
          return this;
        },
        dd: function (a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        },
        sub: function (a, b) {
          if (void 0 !== b)
            return (
              console.warn(
                "JETHREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
              ),
              this.gb(a, b)
            );
          this.x -= a.x;
          this.y -= a.y;
          this.z -= a.z;
          return this;
        },
        gb: function (a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        },
        multiply: function (a, b) {
          if (void 0 !== b)
            return (
              console.warn(
                "JETHREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."
              ),
              (this.x = a.x * b.x),
              (this.y = a.y * b.y),
              (this.z = a.z * b.z),
              this
            );
          this.x *= a.x;
          this.y *= a.y;
          this.z *= a.z;
          return this;
        },
        Fa: function (a) {
          isFinite(a)
            ? ((this.x *= a), (this.y *= a), (this.z *= a))
            : (this.z = this.y = this.x = 0);
          return this;
        },
        af: function (a) {
          return this.Fa(1 / a);
        },
        min: function (a) {
          this.x = Math.min(this.x, a.x);
          this.y = Math.min(this.y, a.y);
          this.z = Math.min(this.z, a.z);
          return this;
        },
        max: function (a) {
          this.x = Math.max(this.x, a.x);
          this.y = Math.max(this.y, a.y);
          this.z = Math.max(this.z, a.z);
          return this;
        },
        Pe: function (a, b) {
          this.x = Math.max(a.x, Math.min(b.x, this.x));
          this.y = Math.max(a.y, Math.min(b.y, this.y));
          this.z = Math.max(a.z, Math.min(b.z, this.z));
          return this;
        },
        floor: function () {
          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          this.z = Math.floor(this.z);
          return this;
        },
        ceil: function () {
          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          this.z = Math.ceil(this.z);
          return this;
        },
        round: function () {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          this.z = Math.round(this.z);
          return this;
        },
        qd: function (a) {
          return this.x * a.x + this.y * a.y + this.z * a.z;
        },
        Kf: function () {
          return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        length: function () {
          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function () {
          return this.af(this.length());
        },
        rb: function (a, b) {
          void 0 === b && (b = 0);
          this.x = a[b];
          this.y = a[b + 1];
          this.z = a[b + 2];
          return this;
        },
      };
      fc.fk = "XYZ";
      fc.prototype = {
        constructor: fc,
        get x() {
          return this.F;
        },
        set x(a) {
          this.F = a;
        },
        get y() {
          return this.G;
        },
        set y(a) {
          this.G = a;
        },
        get z() {
          return this.H;
        },
        set z(a) {
          this.H = a;
        },
        get order() {
          return this.Sa;
        },
        set order(a) {
          this.Sa = a;
        },
        set: function (a, b, d, f) {
          this.F = a;
          this.G = b;
          this.H = d;
          this.Sa = f || this.Sa;
          return this;
        },
        clone: function () {
          return new this.constructor(this.F, this.G, this.H, this.Sa);
        },
        N: function (a) {
          this.F = a.F;
          this.G = a.G;
          this.H = a.H;
          this.Sa = a.Sa;
          return this;
        },
        rb: function (a) {
          this.F = a[0];
          this.G = a[1];
          this.H = a[2];
          void 0 !== a[3] && (this.Sa = a[3]);
          return this;
        },
      };
      Pc.prototype = {
        constructor: Pc,
        set: function (a, b) {
          this.min.N(a);
          this.max.N(b);
          return this;
        },
        clone: function () {
          return new this.constructor().N(this);
        },
        N: function (a) {
          this.min.N(a.min);
          this.max.N(a.max);
          return this;
        },
        empty: function () {
          return (
            this.max.x < this.min.x ||
            this.max.y < this.min.y ||
            this.max.z < this.min.z
          );
        },
        size: function (a) {
          return (a || new Za()).gb(this.max, this.min);
        },
        getParameter: function (a, b) {
          return (b || new Za()).set(
            (a.x - this.min.x) / (this.max.x - this.min.x),
            (a.y - this.min.y) / (this.max.y - this.min.y),
            (a.z - this.min.z) / (this.max.z - this.min.z)
          );
        },
        translate: function (a) {
          this.min.add(a);
          this.max.add(a);
          return this;
        },
      };
      gc.prototype = {
        constructor: gc,
        set: function (a, b, d, f, l, p, w, h, m, q, x, I, u, y, A, k) {
          var g = this.elements;
          g[0] = a;
          g[4] = b;
          g[8] = d;
          g[12] = f;
          g[1] = l;
          g[5] = p;
          g[9] = w;
          g[13] = h;
          g[2] = m;
          g[6] = q;
          g[10] = x;
          g[14] = I;
          g[3] = u;
          g[7] = y;
          g[11] = A;
          g[15] = k;
          return this;
        },
        clone: function () {
          return new gc().rb(this.elements);
        },
        N: function (a) {
          this.elements.set(a.elements);
          return this;
        },
        multiply: function (a, b) {
          return void 0 !== b
            ? (console.warn(
                "JETHREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."
              ),
              pd(this, a, b))
            : pd(this, this, a);
        },
        Fa: function (a) {
          var b = this.elements;
          b[0] *= a;
          b[4] *= a;
          b[8] *= a;
          b[12] *= a;
          b[1] *= a;
          b[5] *= a;
          b[9] *= a;
          b[13] *= a;
          b[2] *= a;
          b[6] *= a;
          b[10] *= a;
          b[14] *= a;
          b[3] *= a;
          b[7] *= a;
          b[11] *= a;
          b[15] *= a;
          return this;
        },
        setPosition: function (a) {
          var b = this.elements;
          b[12] = a.x;
          b[13] = a.y;
          b[14] = a.z;
          return this;
        },
        translate: function () {
          console.error("JETHREE.Matrix4: .translate() has been removed.");
        },
        scale: function (a) {
          var b = this.elements,
            d = a.x,
            f = a.y;
          a = a.z;
          b[0] *= d;
          b[4] *= f;
          b[8] *= a;
          b[1] *= d;
          b[5] *= f;
          b[9] *= a;
          b[2] *= d;
          b[6] *= f;
          b[10] *= a;
          b[3] *= d;
          b[7] *= f;
          b[11] *= a;
          return this;
        },
        rb: function (a) {
          this.elements.set(a);
          return this;
        },
      };
      Qc.prototype = {
        constructor: Qc,
        clone: function () {
          return new this.constructor().N(this);
        },
        N: function (a) {
          this.a = a.a;
          this.b = a.b;
          this.c = a.c;
          this.Ga.N(a.Ga);
          this.color.N(a.color);
          this.$b = a.$b;
          for (var b = 0, d = a.ze.length; b < d; b++)
            this.ze[b] = a.ze[b].clone();
          b = 0;
          for (d = a.$g.length; b < d; b++) this.$g[b] = a.$g[b].clone();
          return this;
        },
      };
      var C = (function () {
          function a(e, n, z) {
            n = e.createShader(n);
            e.shaderSource(n, z);
            e.compileShader(n);
            return e.getShaderParameter(n, e.COMPILE_STATUS) ? n : !1;
          }
          function b(e, n) {
            ha.na() && (n.g = n.g.replace(/gl_FragData\[([0-3])\]/g, "gbuf$1"));
            n.uf = a(e, e.VERTEX_SHADER, n.v, n.name + " VERTEX");
            n.tf = a(e, e.FRAGMENT_SHADER, n.g, n.name + " FRAGMENT");
            var z = e.createProgram();
            e.attachShader(z, n.uf);
            e.attachShader(z, n.tf);
            e.linkProgram(z);
            return z;
          }
          function d(e) {
            e.v = "#version 300 es\n" + e.v.replace(/varying/g, "out");
            e.g = "#version 300 es\n" + e.g.replace(/varying/g, "in");
            e.v = e.v.replace(/texture2D\(/g, "texture(");
            e.g = e.g.replace(/texture2D\(/g, "texture(");
            e.fa ||
              ((e.g = e.g.replace(
                /void main/g,
                "out vec4 FragColor;\nvoid main"
              )),
              (e.g = e.g.replace(/gl_FragColor/g, "FragColor")));
            var n = 0,
              z = [];
            e.v = e.v.replace(
              /attribute ([a-z]+[0-4]*) ([_a-zA-Z,0-9\s]+);/g,
              function (P, B, E) {
                var M = "";
                E.split(",").forEach(function (t) {
                  t = t.trim();
                  M += "layout(location = " + n + ") in " + B + " " + t + ";\n";
                  z.push(t);
                  ++n;
                });
                return M;
              }
            );
            e.kk = z;
          }
          function f(e) {
            return ["float", "sampler2D", "int"]
              .map(function (n) {
                return "precision " + e + " " + n + ";\n";
              })
              .join("");
          }
          function l(e, n) {
            if (n.pi) return !1;
            var z = ha.na();
            W.lq || z || e.enableVertexAttribArray(0);
            void 0 === n.fa && (n.fa = !1);
            n.fa && (n.cd = z ? 3 : 2);
            n.id = L++;
            void 0 === n.cd && (n.cd = 2);
            void 0 === n.precision && (n.precision = D.high);
            n.fa &&
              (n.g =
                (ha.na()
                  ? "precision highp float;\n          layout(location = 0) out vec4 gbuf0;\n          layout(location = 1) out vec4 gbuf1;\n          layout(location = 2) out vec4 gbuf2;\n          layout(location = 3) out vec4 gbuf3;\n"
                  : "#extension GL_EXT_draw_buffers : require\n") + n.g);
            void 0 === n.v &&
              (n.v =
                "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
            var P = f(n.precision);
            n.g = P + n.g;
            n.v = P + n.v;
            z && 3 <= n.cd && d(n);
            n.Ia &&
              n.Ia.forEach(function (B) {
                n.v = n.v.replace(B.search, B.replace);
                n.g = n.g.replace(B.search, B.replace);
              });
            n.qa = b(e, n);
            n.B = {};
            n.i.forEach(function (B) {
              n.B[B] = e.getUniformLocation(n.qa, B);
            });
            n.attributes = {};
            n.xa = [];
            n.Zg = 0;
            void 0 === n.K && (n.K = ["a0"]);
            void 0 === n.S && (n.S = [2]);
            n.K.forEach(function (B, E) {
              var M =
                z && 3 <= n.cd ? n.kk.indexOf(B) : e.getAttribLocation(n.qa, B);
              n.attributes[B] = M;
              n.xa.push(M);
              n.Zg += 4 * n.S[E];
            });
            n.set = function () {
              g !== n.id &&
                (-1 !== g && F.M(),
                (g = n.id),
                (F = n),
                e.useProgram(n.qa),
                n.xa.forEach(function (B) {
                  0 !== B && e.enableVertexAttribArray(B);
                }));
            };
            n.M = function () {
              g = -1;
              n.xa.forEach(function (B) {
                0 !== B && e.disableVertexAttribArray(B);
              });
            };
            n.pi = !0;
          }
          function p(e, n) {
            l(e, n);
            n.set();
            g = -1;
            return n;
          }
          function w() {
            return {
              name: "_",
              g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              i: ["u1"],
              precision: D.high,
            };
          }
          function h() {
            G.j("s107", [{ type: "1i", name: "u1", value: 0 }]);
            G.j("s108", [{ type: "1i", name: "u156", value: 0 }]);
            G.j("s109", [{ type: "1i", name: "u75", value: 0 }]);
          }
          function m() {
            var e = "u41 u146 u147 u148 u149 u42 u80".split(" ").concat(y, A);
            k.s110 = {
              name: "_",
              g: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
              v: "attribute vec3 a0;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.);const vec3 o=vec3(1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,p);vec2 f=u87*e;vec3 c=u87*o;vec2 t=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,q).rgb+vec3(u81,0.,0.),u84,c);float u=mix(texture2D(u41,r).r,0.,u87);a.z+=u;mat3 v=s(a);vec3 w=mix(u146,u85,c);float x=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 y=mat2(h,i,-i,h);b.xy=y*b.xy;float z=mix(u83,1.,u87);vec2 j=u82/t;vec3 k=a0;float A=max(0.,-a0.z-u148)*u149;k.x+=A*sign(a0.x)*(1.-u87);vec3 l=v*(k+w)*x+b;vec2 B=j*z;vec3 C=vec3(g*B,-j)+l*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(C,1.)),vv0=l,vv1=smoothstep(u152,u153,a0.z);}",
              i: ["u152", "u153"].concat(e),
              K: ["a0"],
              precision: D.high,
            };
            k.s111 = {
              name: "_",
              g: "uniform sampler2D u1;uniform vec3 u150;uniform float u73,u74;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u150,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u150,b,u73),a.a*(1.-u74));gl_FragColor=c;}",
              v: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;varying vec2 vv0;const vec2 e=vec2(1.);const vec3 m=vec3(1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,n);vec2 f=u87*e;vec3 c=u87*m;vec2 r=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,o).rgb+vec3(u81,0.,0.),u84,c);float s=mix(texture2D(u41,p).r,0.,u87);a.z+=s;mat3 t=q(a);vec3 u=mix(u146,u85,c);float v=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u83,1.,u87);vec2 j=u82/r;vec3 k=a0;float y=max(0.,-a0.z-u148)*u149;k.x+=y*sign(a0.x)*(1.-u87);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(B,1.)),vv0=a1;}",
              i: ["u150"].concat(I, e),
              K: ["a0", "a1"],
              S: [3, 2],
              precision: D.low,
            };
            k.s112 = {
              name: "_",
              g: "uniform vec3 u150;void main(){gl_FragColor=vec4(u150,0.);}",
              v: "attribute vec3 a0;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;const vec2 e=vec2(1.);const vec3 l=vec3(1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,m);vec2 f=u87*e;vec3 c=u87*l;vec2 q=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,n).rgb+vec3(u81,0.,0.),u84,c);float r=mix(texture2D(u41,o).r,0.,u87);a.z+=r;mat3 s=p(a);vec3 t=mix(u146,u85,c);float u=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u83,1.,u87);vec2 j=u82/q;vec3 k=a0;float x=max(0.,-a0.z-u148)*u149;k.x+=x*sign(a0.x)*(1.-u87);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(A,1.));}",
              i: ["u150"].concat(e),
              S: [3],
              precision: D.low,
            };
            k.s113 = {
              name: "_",
              g: "uniform vec4 u13;varying vec3 vv0;varying float vv1;void main(){float a=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv1);gl_FragColor=vec4(normalize(vv0),a);}",
              v: "attribute vec3 a0,a2;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.);const vec3 o=vec3(1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,p);vec2 f=u87*e;vec3 c=u87*o;vec2 t=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,q).rgb+vec3(u81,0.,0.),u84,c);float u=mix(texture2D(u41,r).r,0.,u87);a.z+=u;mat3 h=s(a);vec3 v=mix(u146,u85,c);float w=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 x=mat2(i,j,-j,i);b.xy=x*b.xy;float y=mix(u83,1.,u87);vec2 k=u82/t;vec3 l=a0;float z=max(0.,-a0.z-u148)*u149;l.x+=z*sign(a0.x)*(1.-u87);vec3 A=h*(l+v)*w+b;vec2 B=k*y;vec3 C=vec3(g*B,-k)+A*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(C,1.)),vv0=h*a2*vec3(1.,-1.,-1.),vv1=a0.y;}",
              i: ["u13", "u80"].concat(e),
              K: ["a0", "a2"],
              precision: D.high,
            };
            k.s114 = {
              name: "_",
              g: "uniform sampler2D u156;uniform vec4 u13;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=vec3(0.,0.,-1.),c=normalize(vv1),b=texture2D(u156,vv2).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv1:a;float m=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv3);gl_FragColor=vec4(a,m);}",
              v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec2 e=vec2(1.);const vec3 q=vec3(1.);const vec2 F=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,r);vec2 f=u87*e;vec3 c=u87*q;vec2 v=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,s).rgb+vec3(u81,0.,0.),u84,c);float w=mix(texture2D(u41,t).r,0.,u87);a.z+=w;mat3 h=u(a);vec3 x=mix(u146,u85,c);float y=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 z=mat2(i,j,-j,i);b.xy=z*b.xy;float A=mix(u83,1.,u87);vec2 k=u82/v;vec3 l=a0;float B=max(0.,-a0.z-u148)*u149;l.x+=B*sign(a0.x)*(1.-u87);vec3 C=h*(l+x)*y+b;vec2 D=k*A;vec3 E=vec3(g*D,-k)+C*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv0=a3,vv2=a1,vv3=a0.y;}",
              i: ["u13", "u80", "u156"].concat(e),
              K: ["a3", "a0", "a2", "a1"],
              S: [4, 3, 3, 2],
              precision: D.high,
            };
            k.s115 = {
              name: "_",
              g: "uniform vec4 u114;uniform float u151;void main(){float b=u151;vec4 a=u114;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
              v: "attribute vec3 a0;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;const vec2 e=vec2(1.);const vec3 l=vec3(1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,m);vec2 f=u87*e;vec3 c=u87*l;vec2 q=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,n).rgb+vec3(u81,0.,0.),u84,c);float r=mix(texture2D(u41,o).r,0.,u87);a.z+=r;mat3 s=p(a);vec3 t=mix(u146,u85,c);float u=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u83,1.,u87);vec2 j=u82/q;vec3 k=a0;float x=max(0.,-a0.z-u148)*u149;k.x+=x*sign(a0.x)*(1.-u87);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(A,1.));}",
              i: ["u114", "u151"].concat(e),
              precision: D.low,
            };
            k.s116 = {
              name: "_",
              g: "uniform sampler2D u75;uniform vec4 u114,u76;uniform float u151;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u151;vec4 a=u114,d=texture2D(u75,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u76*e),c=mix(c,l,u76.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
              v: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u148,u149,u155;varying vec2 vv0;const vec2 e=vec2(1.);const vec3 m=vec3(1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,n);vec2 f=u87*e;vec3 c=u87*m;vec2 r=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,o).rgb+vec3(u81,0.,0.),u84,c);float s=mix(texture2D(u41,p).r,0.,u87);a.z+=s;mat3 t=q(a);vec3 u=mix(u146,u85,c);float v=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u83,1.,u87);vec2 j=u82/r;vec3 k=a0;float y=max(0.,-a0.z-u148)*u149;k.x+=y*sign(a0.x)*(1.-u87);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(B,1.)),vv0=a1;}",
              i: ["u114", "u151"].concat(u, e),
              K: ["a0", "a1"],
              S: [3, 2],
              precision: D.low,
            };
            e = ["u139", "u127", "u140"];
            k.s117 = {
              name: "_",
              g: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
              v: "attribute vec3 a0;uniform mat4 u139,u127,u140;varying vec3 vv0;varying float vv1;void main(){vec4 a=u140*vec4(a0,1.);gl_Position=u139*u127*a,vv0=a.xyz,vv1=1.;}",
              i: e,
              precision: D.high,
            };
            k.s118 = {
              name: "_",
              g: "varying vec3 vv0;void main(){gl_FragColor=vec4(normalize(vv0),1.);}",
              v: "attribute vec3 a0,a2;uniform mat4 u139,u127,u140;varying vec3 vv0;varying float vv1;void main(){vec4 a=u140*vec4(a2,0.);gl_Position=u139*u127*u140*vec4(a0,1.),vv0=a.xyz,vv1=a0.y;}",
              i: e,
              K: ["a0", "a2"],
              precision: D.high,
            };
            k.s108 = {
              name: "_",
              g: "uniform sampler2D u156;uniform vec3 u157;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=normalize(vv1+u157),c=normalize(vv2),b=texture2D(u156,vv3).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv2:a,gl_FragColor=vec4(a,1.);}",
              v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;void main(){vec4 b=u140*vec4(a2,0.),a=u140*vec4(a0,1.);gl_Position=u139*u127*a,vv0=a3,vv2=b.xyz,vv3=a1,vv1=a.xyz;}",
              i: ["u156", "u157"].concat(e),
              K: ["a0", "a2", "a1", "a3"],
              precision: D.high,
            };
            k.s107 = {
              name: "_",
              g: "uniform sampler2D u1;uniform vec3 u150;uniform float u73,u74;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u150,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u150,b,u73),a.a*(1.-u74));gl_FragColor=c;}",
              v: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec2 vv0;const vec4 f=vec4(0.,0.,5e-4,0.);void main(){gl_Position=u139*u127*u140*vec4(a0,1.)+f,vv0=a1;}",
              i: ["u150"].concat(I, e),
              K: ["a0", "a1"],
              Ia: [{ search: "0.0005", replace: Ia.ja() ? "0.0005" : "0.0" }],
              precision: D.low,
            };
            k.s119 = {
              name: "_",
              g: "uniform vec4 u114;uniform float u151;void main(){float b=u151;vec4 a=u114;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
              v: "attribute vec3 a0;uniform mat4 u139,u127,u140;void main(){gl_Position=u139*u127*u140*vec4(a0,1.);}",
              i: ["u114"].concat(e),
              precision: D.high,
            };
            k.s109 = {
              name: "_",
              g: "uniform sampler2D u75;uniform vec4 u114,u76;uniform float u151;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u151;vec4 a=u114,d=texture2D(u75,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u76*e),c=mix(c,l,u76.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
              v: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec2 vv0;void main(){gl_Position=u139*u127*u140*vec4(a0,1.),vv0=a1;}",
              i: ["u114"].concat(u, e),
              K: ["a0", "a1"],
              S: [3, 2],
              precision: D.high,
            };
          }
          function q() {
            for (var e in k) l(c, k[e]);
          }
          var x = !1,
            I = ["u1", "u73", "u74"],
            u = ["u75", "u76"],
            y = "u77 u78 u79 u80 u81 u82 u83".split(" "),
            A = "u84 u85 u86 u87 u88 u89".split(" "),
            k = {},
            g = -1,
            F = null,
            L = 0,
            D = { high: "highp", xq: "mediump", low: "lowp" },
            G = {
              oa: function (e, n) {
                k[e] = n;
                x && l(c, k[e]);
              },
              Dq: function (e, n) {
                k[e] = n;
                n.pi = !1;
                l(c, k[e]);
              },
              zb: function () {
                return x;
              },
              m: function () {
                k.s0 = w();
                k.s75 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u90;uniform float u91;varying vec2 vv0;void main(){vec4 a=texture2D(u1,u90*vv0);gl_FragColor=vec4(pow(a.rgb,u91*vec3(1.)),a.a);}",
                  i: ["u1", "u91", "u90"],
                  precision: D.high,
                };
                k.s1 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                  i: ["u1"],
                  precision: D.low,
                };
                k.s76 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(-1.,1.)*vv0+vec2(1.,0.));}",
                  i: ["u1"],
                  precision: D.low,
                };
                k.s77 = {
                  name: "_",
                  g: "uniform sampler2D u1,u12;uniform float u13;varying vec2 vv0;const vec3 f=vec3(1.);void main(){gl_FragColor=vec4(mix(texture2D(u12,vv0).rgb,texture2D(u1,vv0).rgb,u13*f),1.);}",
                  i: ["u1", "u12", "u13"],
                  precision: D.high,
                };
                k.s78 = {
                  name: "_",
                  g: "uniform sampler2D u1,u12;uniform float u13;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){gl_FragColor=mix(texture2D(u12,vv0),texture2D(u1,vv0),u13*f);}",
                  i: ["u1", "u12", "u13"],
                  precision: D.high,
                };
                k.s12 = {
                  name: "_",
                  g: "uniform sampler2D u1,u92;uniform vec2 u93;uniform float u94;varying vec2 vv0;const vec4 f=vec4(1.);void main(){vec4 b=texture2D(u92,vv0*u93),c=texture2D(u1,vv0*u93);float a=smoothstep(u94,0.,vv0.y);a+=smoothstep(1.-u94,1.,vv0.y),gl_FragColor=mix(c,b,a*f);}",
                  i: ["u1", "u93", "u92", "u94"],
                  precision: D.high,
                };
                k.s80 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);if(a.a<.5)discard;gl_FragColor=a;}",
                  i: ["u1"],
                  precision: D.low,
                };
                k.s81 = {
                  name: "_",
                  g: "uniform sampler2D u1,u95;uniform vec2 u14;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u14*f).rgb+texture2D(u1,a+u14*g).rgb+texture2D(u1,a+u14*h).rgb+texture2D(u1,a+u14*i).rgb;gl_FragColor=vec4(b/5.,1.);}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s82 = {
                  name: "_",
                  g: "uniform sampler2D u1,u95,u41;uniform vec2 u14,u96;varying vec2 vv0;const vec3 k=vec3(1.,1.,1.);const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u14*f).rgb+texture2D(u1,a+u14*g).rgb+texture2D(u1,a+u14*h).rgb+texture2D(u1,a+u14*i).rgb;float c=texture2D(u41,vec2(.5,.5)).a,d=u96.x+pow(c,2.)*(u96.y-u96.x);vec3 j=mix(b/5.,texture2D(u95,a).rgb,d);gl_FragColor=vec4(j,1.);}",
                  i: ["u1", "u95", "u14", "u41", "u96"],
                  precision: D.low,
                };
                k.s83 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;const vec3 f=vec3(.299,.587,.114);const float m=.007813,n=.125,h=8.;void main(){vec2 x=vv0;vec3 o=texture2D(u1,vv0+vec2(-1.,-1.)*u14).xyz,p=texture2D(u1,vv0+vec2(1.,-1.)*u14).xyz,q=texture2D(u1,vv0+vec2(-1.,1.)*u14).xyz,r=texture2D(u1,vv0+vec2(1.,1.)*u14).xyz,s=texture2D(u1,vv0).xyz;float b=dot(o,f),c=dot(p,f),e=dot(q,f),g=dot(r,f),i=dot(s,f),t=min(i,min(min(b,c),min(e,g))),u=max(i,max(max(b,c),max(e,g)));vec2 a;a.x=-(b+c-(e+g)),a.y=b+e-(c+g);float v=max((b+c+e+g)*(.25*n),m),w=1./(min(abs(a.x),abs(a.y))+v);a=min(vec2(h,h),max(vec2(-h,-h),a*w))*u14;vec3 j=.5*(texture2D(u1,vv0+a*-.166667).rgb+texture2D(u1,vv0+a*.166667).rgb),k=j*.5+.25*(texture2D(u1,vv0+a*-.5).rgb+texture2D(u1,vv0+a*.5).rgb);float l=dot(k,f);gl_FragColor=l<t||l>u?vec4(j,1.):vec4(k,1.);}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s84 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec4 b=texture2D(u1,a)+texture2D(u1,a+u14*f)+texture2D(u1,a+u14*g)+texture2D(u1,a+u14*h)+texture2D(u1,a+u14*i);gl_FragColor=b/5.;}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.RGBEtoRGB = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;vec3 f(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=vec4(f(a),1.);}",
                  i: ["u1"],
                  precision: D.high,
                };
                k.s13 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(0.);vec4 g(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),h=exp2(c);vec3 i=clamp(b/h,0.,1.);return vec4(i,(c+128.)/256.);}void main(){vec3 a=texture2D(u1,vv0).rgb;gl_FragColor=g(max(a,f));}",
                  i: ["u1"],
                  precision: D.high,
                };
                k.s85 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u90;uniform float u91;varying vec2 vv0;const vec3 j=vec3(0.),f=vec3(1.);vec4 g(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),h=exp2(c);vec3 i=clamp(b/h,0.,1.);return vec4(i,(c+128.)/256.);}void main(){vec3 a=texture2D(u1,vv0*u90).rgb,b=pow(a,u91*f);gl_FragColor=g(b);}",
                  i: ["u1", "u91", "u90"],
                  precision: D.high,
                };
                k.s86 = {
                  name: "_",
                  g: "uniform sampler2D u97,u98;uniform float u99,u100;varying vec2 vv0;void main(){vec3 a=texture2D(u98,vv0).rgb,b=texture2D(u97,vv0).rgb;gl_FragColor=vec4(b*u100+u99*a,1.);}",
                  i: ["u97", "u98", "u99", "u100"],
                  precision: D.high,
                };
                k.s87 = {
                  name: "_",
                  g: "uniform sampler2D u101,u102;uniform float u91;varying vec2 vv0;const int j=8888;const float e=3.141592;const vec2 k=vec2(0.,0.);const vec3 n=vec3(1.,1.,1.),o=vec3(0.,0.,0.);void main(){float p=e*(vv0.x*2.-1.),q=e/2.*(vv0.y*2.-1.),b,c,r,l,m;vec4 d;vec3 f=o;vec2 g=k,a=k;for(int h=0;h<j;h+=1)a.x=float(h),a.y=floor(a.x/64.),d=texture2D(u102,a/64.),b=e*d.r,c=2.*asin(sqrt(.25+d.g*.25)),l=p+c*cos(b),m=q+c*sin(b),g.x=.5+.5*l/e,g.y=.5+m/e,f+=pow(texture2D(u101,g).rgb,u91*n);f/=float(j),gl_FragColor=vec4(f,1.);}",
                  i: ["u101", "u102", "u91"],
                  precision: D.low,
                  Ia: [{ search: "8888", replace: W.Fm[ha.X()] }],
                };
                k.s88 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);float b=.031496*texture2D(u1,vv0-3.*u14).a+.110236*texture2D(u1,vv0-2.*u14).a+.220472*texture2D(u1,vv0-u14).a+.275591*a.a+.220472*texture2D(u1,vv0+u14).a+.110236*texture2D(u1,vv0+2.*u14).a+.031496*texture2D(u1,vv0+3.*u14).a;gl_FragColor=vec4(a.rgb,4.*b);}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s89 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);float b=.3*pow(a.a,2.);gl_FragColor=vec4(a.rgb+b*f,1.);}",
                  i: ["u1"],
                  precision: D.low,
                };
                k.s90 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){vec4 a=.031496*texture2D(u1,vv0-3.*u14)+.110236*texture2D(u1,vv0-2.*u14)+.220472*texture2D(u1,vv0-u14)+.275591*texture2D(u1,vv0)+.220472*texture2D(u1,vv0+u14)+.110236*texture2D(u1,vv0+2.*u14)+.031496*texture2D(u1,vv0+3.*u14);gl_FragColor=a;}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s91 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0-3.*u14)+texture2D(u1,vv0-2.*u14)+texture2D(u1,vv0-u14)+texture2D(u1,vv0)+texture2D(u1,vv0+u14)+texture2D(u1,vv0+2.*u14)+texture2D(u1,vv0+3.*u14);gl_FragColor=a/7.;}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s92 = {
                  name: "_",
                  g: "uniform sampler2D u1;varying vec2 vv0;const vec4 g=vec4(0.,0.,0.,0.);const float e=256.;void main(){vec4 b=g;float c=0.;vec2 d;for(float a=0.;a<e;a+=1.)d=vec2((a+.5)/e,vv0.y),b+=texture2D(u1,d),c+=1.;gl_FragColor=b/c;}",
                  i: ["u1"],
                  precision: D.high,
                };
                k.s93 = {
                  name: "_",
                  g: "uniform sampler2D u1,u92;varying vec2 vv0;const vec4 h=vec4(1.,1.,1.,1.);const float f=0.,g=.3;void main(){vec4 b=texture2D(u92,vv0),c=texture2D(u1,vv0);float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=mix(c,b,a*h);}",
                  i: ["u1", "u92"],
                  precision: D.high,
                };
                k.s94 = {
                  name: "_",
                  g: "uniform sampler2D u1,u92;varying vec2 vv0;const vec3 h=vec3(1.,1.,1.);const float f=0.,g=.3;vec4 i(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),j=exp2(c);vec3 k=clamp(b/j,0.,1.);return vec4(k,(c+128.)/256.);}void main(){vec3 b=texture2D(u92,vv0).rgb,c=texture2D(u1,vv0).rgb;float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=i(mix(c,b,a*h));}",
                  i: ["u1", "u92"],
                  precision: D.high,
                };
                k.s95 = {
                  name: "_",
                  g: "uniform sampler2D u1,u103,u2,u104;uniform vec4 u105;uniform vec2 u106;uniform float u107,u108,u109,u110;varying vec2 vv0;const vec2 g=vec2(1.,1.),h=vec2(.5,.5);const float e=3.141592;void main(){vec4 d=texture2D(u1,vv0),i=texture2D(u103,vec2(1.-vv0.x,vv0.y));float j=step(texture2D(u104,vec2(.25,.5)).r,1.);vec2 a=vv0*2.-g;float k=texture2D(u2,a*u106*.5+h).r,l=atan(a.x,a.y),m=-(mod(u107,2.*e)-e),b=mod(l-m+e,2.*e)-e,n=smoothstep(0.,u108,b),c=.5+u110*(.5-n);c*=(sign(b)+1.)/2.;vec4 o=i+c*u105*k;gl_FragColor=mix(d,o,j*u109);}",
                  i: "u1 u2 u104 u103 u105 u107 u108 u109 u106 u110".split(" "),
                  precision: D.low,
                };
                var e =
                  "u111 u112 u113 u114 u101 u115 u3 u116 u103 u117 u118 u119 u120 u121 u14".split(
                    " "
                  );
                W.ga_ &&
                  (k.s96 = {
                    name: "_",
                    g: "uniform sampler2D u111,u112,u113,u114,u101,u115,u122,u103;uniform vec3 u116,u119;uniform vec2 u14;uniform float u3,u123,u118,u120,u117;varying vec2 vv0;const float j=3.141592;const vec3 u=vec3(0.,0.,0.),v=vec3(.299,.587,.114);const float w=2.;vec3 l(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 x(vec3 a){float b=atan(a.x,a.z),c=acos(-a.y);return vec2(.5-.5*b/j,1.-c/j);}vec2 y(vec3 a,float b){vec2 d=vec2(1.,.5)/pow(2.,b),f=vec2(0.,1.-pow(.5,b));float g=atan(a.x,a.z),h=acos(-a.y),c=.5+.5*g/j,i=h/j,k=pow(2.,b)/u117;c=(1.-k)*c;return f+vec2(c,i)*d;}void main(){vec4 c=texture2D(u111,vv0);vec3 k=texture2D(u103,vec2(1.-vv0.x,vv0.y)).rgb;if(c.a<.01){gl_FragColor=vec4(k,0.);return;}float z=c.a;vec3 A=c.rgb,B=A+u116;vec4 b=texture2D(u114,vv0),m=texture2D(u112,vv0);vec3 d=m.rgb;float f=m.a;vec4 n=texture2D(u113,vv0);vec3 C=n.rgb;float o=b.r,D=b.g,p=floor(b.b*255.),g=floor(p/16.),E=(p-16.*g)/16.;g/=16.;float F=b.a;f=1.-(1.-f)*(1.-n.a);vec2 G=x(-d);vec3 q=(1.-F)*l(texture2D(u115,G)),r=normalize(B),h=u,s=reflect(-r,d);vec2 H=y(s,floor(D*u3));float I=acos(-s.z),J=smoothstep(u118-u120,u118+u120,I);h=mix(l(texture2D(u101,H)),u119,J);float a=o+(E-o)*pow(1.-dot(d,-r),g*16.);a=clamp(a,0.,1.);float t=1.-u123*texture2D(u122,vv0).r;h*=pow(t,2.),q*=t;vec3 i=C*mix(q,h,a),M=mix(k,i,z*(f*(1.-a)+a));float K=dot(i,v),L=max(0.,(K-1.)/(w-1.));gl_FragColor=vec4(i,L);}",
                    i: e.concat(["u122", "u123"]),
                    precision: D.high,
                  });
                k.s97 = {
                  name: "_",
                  g: "uniform sampler2D u111,u112,u113,u114,u101,u115,u103;uniform vec3 u116,u119;uniform vec2 u14;uniform float u3,u118,u120,u121,u124,u125,u117,u126;varying vec2 vv0;const float g=3.141592;const vec3 G=vec3(0.),l=vec3(1.),H=vec3(.299,.587,.114);const float I=2.;vec3 r(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 J(vec3 a){float b=atan(a.x,-a.z),c=acos(-a.y);return vec2(.5-.5*b/g,1.-c/g);}vec2 K(vec3 b,float c){float a=pow(2.,c),e=u117/8.;a=min(a,e);vec2 f=vec2(1.,.5)/a,h=vec2(-.5/u117,1.-1./a-.5/u117);float i=atan(b.x,b.z),j=acos(-b.y);vec2 k=vec2(.5+.5*i/g,j/g);return h+k*f;}float m(vec3 a,vec3 b){return abs(acos(dot(a,b)));}float n(vec2 a){float b=texture2D(u111,a).a;return step(.01,b);}vec3 o(vec2 a){return texture2D(u103,vec2(1.-a.x,a.y)).rgb;}void main(){vec4 h=texture2D(u111,vv0);if(h.a<.01)gl_FragColor=vec4(o(vv0),0.);float i=h.a;vec3 L=h.rgb,M=L+u116;vec4 c=texture2D(u114,vv0),s=texture2D(u112,vv0);vec3 a=s.rgb;float j=s.a;vec4 k=texture2D(u113,vv0);vec3 e=k.rgb;if(i>1.){gl_FragColor=vec4(mix(o(vv0),e,k.a),1.);return;}e=pow(e,u124*l);float t=c.r,N=c.g,O=c.a,u=floor(c.b*255.),p=floor(u/16.),P=(u-16.*p)/16.;p/=16.,j=1.-(1.-j)*(1.-k.a);vec2 v=vv0+vec2(-1.,0.)*u14,w=vv0+vec2(1.,0.)*u14,x=vv0+vec2(0.,1.)*u14,y=vv0+vec2(0.,-1.)*u14;vec3 Q=texture2D(u112,v).rgb,R=texture2D(u112,w).rgb,S=texture2D(u112,x).rgb,T=texture2D(u112,y).rgb;float U=m(a,Q)*n(v),V=m(a,R)*n(w),W=m(a,S)*n(x),X=m(a,T)*n(y),Y=2.*max(max(U,V),max(W,X)),Z=1.2*clamp(Y/g,0.,1.),_=max(N,Z);vec2 aa=J(a);vec3 ba=r(texture2D(u115,aa)),ca=(1.-O)*ba,z=normalize(M),A=G,B=reflect(-z,a);float da=floor(_*u3);vec2 ea=K(B,da);float fa=acos(-B.z),ga_=smoothstep(u118-u120,u118+u120,fa);vec3 ha=r(texture2D(u101,ea));A=mix(ha,u119,ga_*u121);float b=t+(P-t)*pow(1.+dot(a,z),p*15.);b=clamp(b,0.,1.);vec2 C=vv0;vec3 D=refract(vec3(0.,0.,-1.),a,.666667);float ia=smoothstep(.1,.3,length(D.xy)),E=sqrt(u14.y/u14.x),ja=smoothstep(.3,.8,i);C+=ja*D.xy*vec2(1./E,E)*ia*.03;vec3 ka=e*mix(ca,A,b);float q=i*(j*(1.-b)+b);vec3 f=mix(o(C),pow(ka,l/u124),q);float F=dot(f,H),la=max(0.,(F-1.)/(I-1.));f=mix(F*l,f,mix(1.,u125,q)*l);float ma=mix(la,q,u126);gl_FragColor=vec4(f,ma);}",
                  i: e.concat(["u126", "u124", "u125"]),
                  precision: D.high,
                };
                W.ga_ &&
                  ((k.s98 = {
                    name: "_",
                    g: "uniform sampler2D u111,u112;uniform mat4 u127;uniform vec2 u128,u14,u129;uniform float u130,u131,u132,u133,u134,u135,u136,u137,u123;varying vec2 vv0;const float PI=3.141593,HALFPI=1.570796,N=8888.8;void main(){vec2 uvt=vv0+u129;vec4 pos=texture2D(u111,uvt);if(pos.a<.01){gl_FragColor=vec4(0.,0.,0.,1.);return;}vec3 co0=pos.rgb;float c=cos(u130),s=sin(u130);vec3 no0=texture2D(u112,uvt).rgb;float zv=(u127*vec4(co0,1.)).z;vec3 co;vec2 scale=u128/abs(zv),uv,duv=u14*vec2(c,s)*scale;vec3 dp,dpn;float dzMax=0.,angleMin=0.,angle;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u111,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u136,u137,length(dp)),angleMin=max(angleMin,angle),dzMax=max(dzMax,sin(angle)*length(dp));float angleMinInv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u111,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u136,u137,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMinInv=max(angleMinInv,angle);duv=u14*vec2(s,c)*scale;float angleMin2=0.;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u111,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u136,u137,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2=max(angleMin2,angle);float angleMin2Inv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u111,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u136,u137,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2Inv=max(angleMin2Inv,angle);float omegaMin=PI/4.*(angleMin+angleMinInv)*(angleMin2+angleMin2Inv),dzFactor=clamp(dzMax/u133,u134,1.),ao=dzFactor*clamp(u132*omegaMin*u135,0.,u123);gl_FragColor=vec4(ao,ao,ao,u131);}",
                    i: "u111 u112 u132 u131 u130 u14 u138 u133 u134 u135 u136 u137 u127 u128 u123".split(
                      " "
                    ),
                    Ia: [
                      { search: "8888.8", replace: W.Fk[ha.X()].toFixed(1) },
                    ],
                    precision: D.low,
                  }),
                  (k.s99 = {
                    name: "_",
                    g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4),j=vec2(-1.9,.9),k=vec2(.9,1.9),l=vec2(-.9,-1.9),m=vec2(1.9,-.9);void main(){vec2 a=vv0;vec4 b=texture2D(u1,a)+texture2D(u1,a+u14*f)+texture2D(u1,a+u14*g)+texture2D(u1,a+u14*h)+texture2D(u1,a+u14*i);b+=texture2D(u1,a+u14*j)+texture2D(u1,a+u14*k)+texture2D(u1,a+u14*l)+texture2D(u1,a+u14*m),gl_FragColor=b/9.;}",
                    i: ["u1", "u14"],
                    precision: D.low,
                  }));
                k.s100 = {
                  name: "_",
                  g: "varying vec3 vv0;void main(){gl_FragColor=vec4(vv0,1.);}",
                  v: "attribute vec3 a0;uniform mat4 u139,u127,u140;varying vec3 vv0;void main(){vec4 a=u139*u127*u140*vec4(a0,1.);gl_Position=a,vv0=a.xyz/a.w;}",
                  i: ["u139", "u127", "u140"],
                  precision: D.low,
                };
                k.s101 = {
                  name: "_",
                  g: "uniform sampler2D u141,u115,u102;uniform mat4 u139,u142;uniform vec2 u143;uniform float u144;varying vec2 vv0;const float n=8888.8,o=9999.9,p=25.,v=50.,w=1.2,e=3.141592;const vec4 x=vec4(0.,0.,0.,0.),A=vec4(1.,1.,1.,1.);const vec2 f=vec2(.5,.5);vec2 y(vec3 a){float b=atan(a.x,a.z),c=acos(a.y);return vec2(.5-.5*b/e,1.-c/e);}void main(){float d,a,q;vec2 z=vec2(vv0.x,1.-vv0.y),b;vec3 r=vec3(u143*(z-f),0.),B=vec3(u142*vec4(r,1.)),g,s;vec4 t=x,h,c,u;vec3 i;int j;for(float k=0.;k<n;k+=1.){b.x=k,b.y=floor(b.x/64.),c=texture2D(u102,b/64.),d=e*c.r,a=2.*asin(sqrt(.25+c.g*.25)),g=vec3(cos(d)*sin(a),sin(d)*sin(a),-cos(a)),q=p+(.5+.5*c.b)*(v-p),j=0;for(float l=0.;l<=o;l+=1.){u=vec4(r+g*q*pow(l/o,w),1.),h=u139*u,i=h.xyz/h.w;if(texture2D(u141,f+f*i.xy).z<i.z){j=1;break;}}if(j==1)continue;s=vec3(u142*vec4(g,0.)),t+=texture2D(u115,y(s));}gl_FragColor=vec4(u144*t.rgb/n,1.);}",
                  i: "u141 u115 u102 u139 u142 u143 u144".split(" "),
                  Ia: [
                    { search: "8888.8", replace: W.Ho[ha.X()].toFixed(1) },
                    { search: "9999.9", replace: W.Io[ha.X()].toFixed(1) },
                  ],
                  precision: D.low,
                };
                k.s102 = {
                  name: "_",
                  g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){vec4 a=.285714*texture2D(u1,vv0-u14)+.428571*texture2D(u1,vv0)+.285714*texture2D(u1,vv0+u14);gl_FragColor=a;}",
                  i: ["u1", "u14"],
                  precision: D.low,
                };
                k.s103 = {
                  name: "_",
                  g: "uniform sampler2D u1,u145;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                  v: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u139,u127;varying vec2 vv0;void main(){vec4 a=u139*u127*vec4(a0,1.);gl_Position=a,vv0=a1;}",
                  i: ["u139", "u127", "u1"],
                  K: ["a0", "a1"],
                  precision: D.low,
                };
                if (ha.ca()) {
                  e =
                    "u41 u146 u147 u148 u149 u42 u114 u150 u151 u13 u152 u153 u80"
                      .split(" ")
                      .concat(y, A);
                  ha.Ci() ||
                    (k.s104 = {
                      name: "_",
                      v: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                      g: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,0.,0.),gl_FragData[2]=vec4(0.,0.,0.,0.),gl_FragData[3]=vec4(0.,0.,0.,0.);}",
                      i: [],
                      precision: D.low,
                      fa: !0,
                    });
                  k.s105 = {
                    name: "_",
                    v: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                    g: "uniform vec4 color;void main(){gl_FragData[0]=color,gl_FragData[1]=color,gl_FragData[2]=color,gl_FragData[3]=color;}",
                    i: ["color"],
                    fa: !0,
                  };
                  k.s106NNGLcolor = {
                    name: "_",
                    g: "uniform vec4 u114,u13;uniform vec3 u150;uniform float u151;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv3),c=u151;vec4 a=u114;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u150,0.),gl_FragData[3]=a;}",
                    v: "attribute vec3 a0,a2;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec3 vv0,vv1;varying float vv2,vv3;const vec2 e=vec2(1.);const vec3 r=vec3(1.);const vec2 F=vec2(-1.,1.),s=vec2(.16,.5),t=vec2(.5,.5),u=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 v(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,s);vec2 f=u87*e;vec3 c=u87*r;vec2 w=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,t).rgb+vec3(u81,0.,0.),u84,c);float x=mix(texture2D(u41,u).r,0.,u87);a.z+=x;mat3 h=v(a);vec3 y=mix(u146,u85,c);float z=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 A=mat2(i,j,-j,i);b.xy=A*b.xy;float B=mix(u83,1.,u87);vec2 k=u82/w;vec3 l=a0;float C=max(0.,-a0.z-u148)*u149;l.x+=C*sign(a0.x)*(1.-u87);vec3 m=h*(l+y)*z+b;vec2 D=k*B;vec3 E=vec3(g*D,-k)+m*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv2=smoothstep(u152,u153,a0.z),vv0=m,vv3=a0.y;}",
                    i: e,
                    K: ["a0", "a2"],
                    S: [3, 3],
                    fa: !0,
                  };
                  k.s106NNGLtexture = {
                    name: "_",
                    g: "uniform sampler2D u1;uniform vec4 u114,u13;uniform vec3 u150;uniform float u151,u73,u74;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv4),d=u151;vec4 b=u114;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u150,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u150,l,u73),a.a*(1.-u74));gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                    v: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.);const vec3 s=vec3(1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,t);vec2 f=u87*e;vec3 c=u87*s;vec2 x=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,u).rgb+vec3(u81,0.,0.),u84,c);float y=mix(texture2D(u41,v).r,0.,u87);a.z+=y;mat3 h=w(a);vec3 z=mix(u146,u85,c);float A=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u83,1.,u87);vec2 k=u82/x;vec3 l=a0;float D=max(0.,-a0.z-u148)*u149;l.x+=D*sign(a0.x)*(1.-u87);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u152,u153,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                    i: e.concat(I),
                    K: ["a0", "a2", "a1"],
                    S: [3, 3, 2],
                    fa: !0,
                  };
                  k.s106NNGLtextureNormalMap = {
                    name: "_",
                    g: "uniform vec4 u114,u13;uniform vec3 u150;uniform sampler2D u1,u156;uniform float u151,u73,u74;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.);void main(){float m=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u156,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u151;vec4 c=u114;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u150,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u150,t,u73),a.a*(1.-u74));gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                    v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.);const vec3 t=vec3(1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,u);vec2 f=u87*e;vec3 c=u87*t;vec2 y=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,v).rgb+vec3(u81,0.,0.),u84,c);float z=mix(texture2D(u41,w).r,0.,u87);a.z+=z;mat3 h=x(a);vec3 A=mix(u146,u85,c);float B=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u83,1.,u87);vec2 k=u82/y;vec3 l=a0;float E=max(0.,-a0.z-u148)*u149;l.x+=E*sign(a0.x)*(1.-u87);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv4=smoothstep(u152,u153,a0.z),vv0=a3,vv3=a1,vv1=m,vv5=a0.y;}",
                    i: e.concat(I, ["u156"]),
                    K: ["a3", "a0", "a2", "a1"],
                    S: [4, 3, 3, 2],
                    fa: !0,
                  };
                  k.s106NNGLtextureParamsMap = {
                    name: "_",
                    g: "uniform sampler2D u1,u75;uniform vec4 u114,u13,u76;uniform vec3 u150;uniform float u151,u73,u74;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv4),d=u151;vec4 a=u114,e=texture2D(u75,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u76*f),d=mix(d,r,u76.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u150,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u150,u,u73),c.a*(1.-u74));gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                    v: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.);const vec3 s=vec3(1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,t);vec2 f=u87*e;vec3 c=u87*s;vec2 x=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,u).rgb+vec3(u81,0.,0.),u84,c);float y=mix(texture2D(u41,v).r,0.,u87);a.z+=y;mat3 h=w(a);vec3 z=mix(u146,u85,c);float A=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u83,1.,u87);vec2 k=u82/x;vec3 l=a0;float D=max(0.,-a0.z-u148)*u149;l.x+=D*sign(a0.x)*(1.-u87);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u152,u153,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                    i: e.concat(I, u),
                    K: ["a0", "a2", "a1"],
                    S: [3, 3, 2],
                    fa: !0,
                  };
                  k.s106NNGLtextureNormalParamsMap = {
                    name: "_",
                    g: "uniform sampler2D u1,u156,u75;uniform vec4 u114,u13,u76;uniform vec3 u150;uniform float u151,u73,u74;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u156,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u151;vec4 a=u114,f=texture2D(u75,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u76*l),e=mix(e,z,u76.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u150,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u150,C,u73),c.a*(1.-u74));gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                    v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u154;uniform float u147,u152,u153,u148,u149,u155;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.);const vec3 t=vec3(1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,u);vec2 f=u87*e;vec3 c=u87*t;vec2 y=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,v).rgb+vec3(u81,0.,0.),u84,c);float z=mix(texture2D(u41,w).r,0.,u87);a.z+=z;mat3 h=x(a);vec3 A=mix(u146,u85,c);float B=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u83,1.,u87);vec2 k=u82/y;vec3 l=a0;float E=max(0.,-a0.z-u148)*u149;l.x+=E*sign(a0.x)*(1.-u87);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv4=smoothstep(u152,u153,a0.z),vv0=a3,vv3=a1,vv1=m,vv5=a0.y;}",
                    i: e.concat(I, ["u156"], u),
                    K: ["a3", "a0", "a2", "a1"],
                    S: [4, 3, 3, 2],
                    fa: !0,
                  };
                  e = "u139 u127 u140 u114 u150 u151 u13".split(" ");
                  k.s106color = {
                    name: "_",
                    g: "uniform vec4 u114,u13;uniform vec3 u150;uniform float u151;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv3),c=u151;vec4 a=u114;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u150,0.),gl_FragData[3]=a;}",
                    v: "attribute vec3 a0,a2;uniform mat4 u139,u127,u140;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){vec4 a=u140*vec4(a0,1.),b=u140*vec4(a2,0.);gl_Position=u139*u127*a,vv0=a.xyz,vv1=b.xyz,vv2=1.,vv3=a0.y;}",
                    i: e,
                    K: ["a0", "a2"],
                    fa: !0,
                  };
                  k.s106 = {
                    name: "_",
                    g: "uniform sampler2D u1;uniform vec4 u114,u13;uniform vec3 u150;uniform float u151,u73,u74;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv4),d=u151;vec4 b=u114;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u150,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u150,l,u73),a.a*(1.-u74));gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                    v: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u140*vec4(a0,1.),b=u140*vec4(a2,0.);gl_Position=u139*u127*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                    i: e.concat(I),
                    K: ["a0", "a2", "a1"],
                    fa: !0,
                  };
                  var n = ["u156", "u157"];
                  k.s106NormalMap = {
                    name: "_",
                    g: "uniform sampler2D u1,u156;uniform vec4 u114,u13;uniform vec3 u157,u150;uniform float u151,u73,u74;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.);void main(){float m=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u156,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u151;vec4 c=u114;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u150,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u150,t,u73),a.a*(1.-u74));gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                    v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u140*vec4(a0,1.),b=u140*vec4(a2,0.);gl_Position=u139*u127*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                    i: e.concat(I, n),
                    K: ["a0", "a2", "a1", "a3"],
                    fa: !0,
                  };
                  k.s106ParamsMap = {
                    name: "_",
                    g: "uniform sampler2D u1,u75;uniform vec4 u114,u13,u76;uniform vec3 u150;uniform float u151,u73,u74;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv4),d=u151;vec4 a=u114,e=texture2D(u75,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u76*f),d=mix(d,r,u76.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u150,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u150,u,u73),c.a*(1.-u74));gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                    v: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u140*vec4(a0,1.),b=u140*vec4(a2,0.);gl_Position=u139*u127*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                    i: e.concat(I, u),
                    K: ["a0", "a2", "a1"],
                    fa: !0,
                  };
                  k.s106NormalParamsMap = {
                    name: "_",
                    g: "uniform sampler2D u1,u156,u75;uniform vec4 u114,u13,u76;uniform vec3 u157,u150;uniform float u151,u73,u74;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u156,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u151;vec4 a=u114,f=texture2D(u75,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u76*l),e=mix(e,z,u76.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u150,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u150,C,u73),c.a*(1.-u74));gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                    v: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u139,u127,u140;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u140*vec4(a0,1.),b=u140*vec4(a2,0.);gl_Position=u139*u127*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                    i: e.concat(I, n, u),
                    K: ["a0", "a2", "a1", "a3"],
                    fa: !0,
                  };
                } else m();
                q();
                e = [{ type: "1i", name: "u1", value: 0 }];
                G.j("s0", e);
                G.j("s75", e);
                G.j("s1", e);
                G.j("s77", [{ type: "1i", name: "u12", value: 1 }].concat(e));
                G.j("s78", [{ type: "1i", name: "u12", value: 1 }].concat(e));
                G.j("s12", [{ type: "1i", name: "u92", value: 1 }].concat(e));
                G.j("s80", e);
                G.j("s81", e);
                G.j(
                  "s82",
                  [
                    { type: "1i", name: "u95", value: 1 },
                    { type: "1i", name: "u41", value: 2 },
                  ].concat(e)
                );
                G.j("s83", e);
                G.j("s84", e);
                G.j("s13", e);
                G.j("s85", e);
                G.j("s86", [
                  { type: "1i", name: "u97", value: 0 },
                  { type: "1i", name: "u98", value: 1 },
                ]);
                G.j("s87", [
                  { type: "1i", name: "u101", value: 0 },
                  { type: "1i", name: "u102", value: 1 },
                ]);
                G.j("s88", e);
                G.j("s89", e);
                G.j("s90", e);
                G.j("s91", e);
                G.j("s92", e);
                G.j("s93", [{ type: "1i", name: "u92", value: 1 }].concat(e));
                G.j("s94", [{ type: "1i", name: "u92", value: 1 }].concat(e));
                W.ga_ &&
                  (G.j("s98", [
                    { type: "1i", name: "u111", value: 0 },
                    { type: "1i", name: "u112", value: 1 },
                    { type: "1f", name: "u133", value: W.tk },
                    { type: "1f", name: "u134", value: W.uk },
                    { type: "1f", name: "u135", value: W.Gk },
                    { type: "1f", name: "u136", value: W.xk },
                    { type: "1f", name: "u137", value: W.yk },
                    { type: "1f", name: "u132", value: 1 },
                    { type: "1f", name: "u123", value: 1 },
                  ]),
                  G.j("s99", e));
                n = [
                  { type: "1i", name: "u111", value: 0 },
                  { type: "1i", name: "u112", value: 1 },
                  { type: "1i", name: "u113", value: 2 },
                  { type: "1i", name: "u101", value: 3 },
                  { type: "1i", name: "u115", value: 4 },
                  { type: "1i", name: "u114", value: 6 },
                  { type: "1i", name: "u103", value: 7 },
                  { type: "1f", name: "u121", value: 0 },
                  { type: "1f", name: "u118", value: 0 },
                  { type: "1f", name: "u120", value: 0 },
                ];
                W.ga_ &&
                  G.j(
                    "s96",
                    n.concat([
                      { type: "1f", name: "u123", value: W.wk[ha.X()] },
                      { type: "1i", name: "u122", value: 5 },
                    ])
                  );
                G.j(
                  "s97",
                  n.concat([
                    { type: "1f", name: "u124", value: W.Rc },
                    { type: "1f", name: "u125", value: W.jg },
                    { type: "1f", name: "u126", value: 0 },
                  ])
                );
                G.j("s101", [
                  { type: "1i", name: "u141", value: 0 },
                  { type: "1i", name: "u115", value: 1 },
                  { type: "1i", name: "u102", value: 2 },
                  { type: "1f", name: "u144", value: W.Go },
                ]);
                G.j("s102", e);
                G.j("s103", e);
                G.j(
                  "s95",
                  [
                    { type: "1i", name: "u2", value: 1 },
                    { type: "1i", name: "u104", value: 2 },
                    { type: "1i", name: "u103", value: 3 },
                    { type: "1f", name: "u109", value: 1 },
                    { type: "2f", name: "u106", value: [0, 0] },
                  ].concat(e)
                );
                ha.ca()
                  ? (G.j("s106", e),
                    G.j(
                      "s106NormalMap",
                      [{ type: "1i", name: "u156", value: 1 }].concat(e)
                    ),
                    G.j(
                      "s106ParamsMap",
                      [{ type: "1i", name: "u75", value: 1 }].concat(e)
                    ),
                    G.j(
                      "s106NormalParamsMap",
                      [
                        { type: "1i", name: "u156", value: 1 },
                        { type: "1i", name: "u75", value: 2 },
                      ].concat(e)
                    ))
                  : h();
                x = !0;
              },
              to: function () {
                m();
                q();
                h();
              },
              Ad: function () {
                return F.id;
              },
              Cd: function () {
                return y;
              },
              Dd: function () {
                return A;
              },
              set: function (e) {
                Cb.Cj(G);
                k[e].set();
              },
              Eb: function (e) {
                return p(e, w());
              },
              he: function (e) {
                return p(e, {
                  name: "_",
                  g: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                  i: [],
                  precision: D.high,
                });
              },
              wo: function (e) {
                return p(e, {
                  name: "_",
                  g: "const vec4 d=vec4(.5,.5,.5,.5);void main(){gl_FragData[0]=d,gl_FragData[1]=d,gl_FragData[2]=d,gl_FragData[3]=d;}",
                  i: [],
                  precision: D.high,
                  fa: !0,
                });
              },
              M: function () {
                -1 !== g && F.M();
              },
              je: function () {
                var e = 0;
                F.xa.forEach(function (n, z) {
                  z = F.S[z];
                  c.vertexAttribPointer(n, z, c.FLOAT, !1, F.Zg, e);
                  e += 4 * z;
                });
              },
              fc: function () {
                G.hc(c);
              },
              hc: function (e) {
                e.vertexAttribPointer(F.xa[0], 2, e.FLOAT, !1, 8, 0);
              },
              Hq: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 12, 0);
              },
              Ra: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 32, 0);
              },
              bb: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 24, 0);
              },
              uj: function () {
                c.vertexAttribPointer(F.attributes.a2, 3, c.FLOAT, !1, 32, 12);
              },
              vj: function () {
                c.vertexAttribPointer(F.attributes.a2, 3, c.FLOAT, !1, 24, 12);
              },
              Uc: function () {
                c.vertexAttribPointer(F.attributes.a1, 2, c.FLOAT, !1, 32, 24);
              },
              Iq: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 20, 0);
                c.vertexAttribPointer(F.attributes.a1, 2, c.FLOAT, !1, 20, 12);
              },
              ho: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 32, 0);
                c.vertexAttribPointer(F.attributes.a2, 3, c.FLOAT, !1, 32, 12);
                c.vertexAttribPointer(F.attributes.a1, 2, c.FLOAT, !1, 32, 24);
              },
              io: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 32, 0);
                c.vertexAttribPointer(F.attributes.a2, 3, c.FLOAT, !1, 32, 12);
              },
              jo: function () {
                c.vertexAttribPointer(F.attributes.a0, 3, c.FLOAT, !1, 24, 0);
                c.vertexAttribPointer(F.attributes.a2, 3, c.FLOAT, !1, 24, 12);
              },
              fe: function () {
                c.vertexAttribPointer(F.attributes.a3, 4, c.FLOAT, !1, 16, 0);
              },
              ie: function (e, n) {
                c.uniform1i(F.B[e], n);
              },
              C: function (e, n) {
                c.uniform1f(F.B[e], n);
              },
              O: function (e, n, z) {
                c.uniform2f(F.B[e], n, z);
              },
              Bg: function (e, n) {
                c.uniform2fv(F.B[e], n);
              },
              Cg: function (e, n, z, P) {
                c.uniform3f(F.B[e], n, z, P);
              },
              Dg: function (e, n) {
                c.uniform3fv(F.B[e], n);
              },
              Ba: function (e, n) {
                c.uniform4fv(F.B[e], n);
              },
              Ao: function (e, n) {
                c.uniformMatrix2fv(F.B[e], !1, n);
              },
              Bo: function (e, n) {
                c.uniformMatrix3fv(F.B[e], !1, n);
              },
              Vc: function (e, n) {
                c.uniformMatrix4fv(F.B[e], !1, n);
              },
              j: function (e, n) {
                G.set(e);
                n.forEach(function (z) {
                  switch (z.type) {
                    case "4f":
                      c.uniform4fv(F.B[z.name], z.value);
                      break;
                    case "3f":
                      c.uniform3fv(F.B[z.name], z.value);
                      break;
                    case "2f":
                      c.uniform2fv(F.B[z.name], z.value);
                      break;
                    case "1f":
                      c.uniform1f(F.B[z.name], z.value);
                      break;
                    case "1i":
                      c.uniform1i(F.B[z.name], z.value);
                      break;
                    case "mat2":
                      c.uniformMatrix2fv(F.B[z.name], !1, z.value);
                      break;
                    case "mat4":
                      c.uniformMatrix4fv(F.B[z.name], !1, z.value);
                  }
                });
              },
              I: function () {
                for (var e in k) {
                  var n = k[e];
                  c.detachShader(n.qa, n.uf);
                  c.detachShader(n.qa, n.tf);
                  c.deleteShader(n.uf);
                  c.deleteShader(n.tf);
                  c.deleteProgram(n.qa);
                }
              },
              A: function () {
                c.disableVertexAttribArray(0);
                G.M();
                G.I();
                L = 0;
                x = !1;
                F = null;
                g = -1;
              },
            };
          return G;
        })(),
        $a = (function () {
          var a = {},
            b = [],
            d = !1,
            f = 0,
            l = 0,
            p = -1,
            w = -1,
            h = 1,
            m = null,
            q = !1,
            x = null,
            I = !1,
            u = !1,
            y = !1,
            A = !1,
            k = !1,
            g = !1,
            F = -1,
            L = -1,
            D = !1,
            G = !1,
            e = null,
            n = null,
            z = -1,
            P = -1,
            B = null,
            E = -1,
            M,
            t = null,
            v = null,
            Q = null,
            X = null,
            U = null,
            ia = null,
            O = null,
            ka = [
              { type: "1f", name: "u87", value: 0 },
              { type: "1f", name: "u152", value: 0 },
              { type: "1f", name: "u153", value: 0 },
              { type: "1f", name: "u82", value: 1 },
              { type: "1f", name: "u78", value: 0 },
              { type: "1f", name: "u79", value: 0 },
              { type: "1f", name: "u89", value: 1 },
            ],
            Qa = {
              m: function (H, r) {
                a.Fg = H;
                ha.Vg();
                Uc.ef();
                Yb.ef(H.Be);
                p = H.hf;
                w = H.np;
                h = H.Ae;
                F = H.$f;
                L = H.ag;
                var N = [
                  { type: "1f", name: "u82", value: p },
                  { type: "1f", name: "u78", value: F },
                  { type: "1f", name: "u79", value: L },
                  { type: "1f", name: "u83", value: H.Yn },
                  { type: "mat4", name: "u77", value: H.Cn },
                  { type: "2f", name: "u42", value: H.ek },
                ];
                H.Tg = N;
                var ca = [
                  { type: "3f", name: "u84", value: [0, 0, 0] },
                  { type: "3f", name: "u85", value: H.dh },
                  { type: "3f", name: "u86", value: H.bh },
                  { type: "1f", name: "u87", value: 0 },
                  { type: "1f", name: "u88", value: H.Be },
                  { type: "1f", name: "u89", value: 1 },
                ];
                H.Vj = ca;
                Qa.Bm(H, r);
                d || void 0 !== H.Ha || (H.Ha = [0, 0, 120]);
                G = D = J.vf;
                if (!d && D) {
                  r = 1 * ha.vb();
                  var fa = 1 * ha.ub(),
                    ma = { isLinear: !0, isPot: !1, width: r, height: fa };
                  e = ba.instance(ma);
                  n = ba.instance(ma);
                  z = 1 / r;
                  P = 1 / fa;
                }
                N = [
                  { type: "1i", name: "u41", value: 1 },
                  { type: "3f", name: "u80", value: H.Ha },
                  { type: "1f", name: "u148", value: H.gd },
                  { type: "1f", name: "u149", value: H.Mb },
                ].concat(N, ca);
                m = H.Oc;
                ca = [
                  { type: "1f", name: "u152", value: m[0] },
                  { type: "1f", name: "u153", value: m[1] },
                ];
                ha.ca()
                  ? ((r = [{ type: "1i", name: "u1", value: 0 }]),
                    (fa = [{ type: "1i", name: "u156", value: 2 }]),
                    C.j("s106NNGLcolor", N.concat(ca)),
                    C.j("s106NNGLtexture", [].concat(r, N, ca)),
                    C.j("s106NNGLtextureNormalMap", [].concat(r, fa, N, ca)),
                    C.j(
                      "s106NNGLtextureParamsMap",
                      [{ type: "1i", name: "u75", value: 2 }].concat(r, N, ca)
                    ),
                    C.j(
                      "s106NNGLtextureNormalParamsMap",
                      [{ type: "1i", name: "u75", value: 3 }].concat(
                        r,
                        fa,
                        N,
                        ca
                      )
                    ))
                  : (C.j("s110", N.concat(ca)),
                    C.j(
                      "s111",
                      [{ type: "1i", name: "u1", value: 0 }].concat(N)
                    ),
                    C.j("s112", N),
                    C.j("s113", N),
                    C.j(
                      "s114",
                      N.concat([{ type: "1i", name: "u156", value: 0 }])
                    ),
                    C.j("s115", N),
                    C.j(
                      "s116",
                      N.concat([{ type: "1i", name: "u75", value: 0 }])
                    ));
                C.j("s82", [{ type: "2f", name: "u96", value: H.Mg }]);
                C.j(W.ga_ ? "s96" : "s97", [
                  { type: "1f", name: "u118", value: H.Ie },
                  { type: "3f", name: "u119", value: H.pg },
                  { type: "1f", name: "u120", value: H.Ve },
                  { type: "1f", name: "u121", value: 1 },
                  { type: "3f", name: "u116", value: H.jk },
                ]);
                if ((M = H.Sd))
                  (B = H.bn),
                    (E = H.Td),
                    C.j("s95", [
                      { type: "4f", name: "u105", value: H.Rd },
                      { type: "1f", name: "u108", value: H.Qf },
                      { type: "2f", name: "u106", value: H.an },
                      { type: "1f", name: "u110", value: Math.sign(E) },
                    ]);
                b.forEach(function (ya) {
                  ya.pj(H);
                });
                d = !0;
              },
              dc: function (H) {
                u && za.ia.dc(H);
                A && za.ua.dc(H);
              },
              Bm: function (H, r) {
                void 0 !== za.ia &&
                  H.jc &&
                  ha.ca() &&
                  (za.ia.m(H),
                  (I = !0),
                  r.push(function (N) {
                    za.ia.dc(N);
                    u = !y;
                  }));
                void 0 !== za.ua &&
                  H.od &&
                  (za.ua.m(H),
                  r.push(function (N) {
                    za.ua.dc(N);
                    A = !0;
                  }));
                void 0 !== za.rc && H.Le && (za.rc.m(H), (g = k = !0));
                void 0 !== za.mb &&
                  (za.mb.m(H),
                  (x = za.mb.Dm({
                    width: H.Gc,
                    height: 2 * H.Gc,
                    depth: 1.5 * H.Gc,
                    Gl: -H.zf,
                    Va: H.xf,
                    kl: H.yf,
                  })),
                  (q = !0));
              },
              yo: function (H, r, N, ca) {
                H &&
                  ((O = H),
                  I && za.ia.ec(H),
                  A && za.ua.ec(H),
                  k && za.rc.ec(H),
                  b.forEach(function (fa) {
                    fa.ec(H);
                  }));
                N && (X = N);
                ca && (U = ca);
              },
              Fb: function (H) {
                ha.ca()
                  ? (C.j("s106NNGLcolor", H),
                    C.j("s106NNGLtexture", H),
                    C.j("s106NNGLtextureNormalMap", H),
                    C.j("s106NNGLtextureParamsMap", H),
                    C.j("s106NNGLtextureNormalParamsMap", H))
                  : (C.j("s110", H),
                    C.j("s111", H),
                    C.j("s112", H),
                    C.j("s113", H),
                    C.j("s114", H),
                    C.j("s115", H),
                    C.j("s116", H));
              },
              eb: function (H, r, N) {
                var ca = [H[0] + r[0], H[1] + r[1], H[2] + r[2]];
                ca = [ca[0] + N[0], ca[1] + N[1], ca[2] + N[2]];
                a.ce = ca;
                a.ln = r;
                a.$o = N;
                Qa.Fb([{ type: "3f", name: "u146", value: ca }]);
                ha.ca() && (I && za.ia.eb(H, r, N), A && za.ua.eb(ca));
                q && za.mb.eb(H, N);
              },
              fb: function (H, r, N) {
                var ca = H * r * N;
                a.mn = r;
                a.ap = N;
                a.vm = H;
                Qa.Fb([{ type: "1f", name: "u147", value: ca }]);
                ha.ca() && (I && za.ia.fb(H * r, N), A && za.ua.fb(ca));
                q && za.mb.fb(H, N);
              },
              jj: function () {
                Qa.eb(a.ce, a.ln, a.$o);
                Qa.fb(a.vm, a.mn, a.ap);
                Qa.Aj(a.rx);
                Qa.m(a.Fg);
                Qa.wj(a.Ok, a.Mb);
              },
              Aj: function (H) {
                a.rx = H;
                Qa.Fb([{ type: "1f", name: "u81", value: H }]);
                ha.ca() && (I && za.ia.zg(H), A && za.ua.zg(H));
              },
              wj: function (H, r) {
                a.Ok = H;
                a.Mb = r;
                Qa.Fb([
                  { type: "1f", name: "u148", value: H },
                  { type: "1f", name: "u149", value: r },
                ]);
              },
              qo: function (H) {
                m = H;
                0 === f &&
                  Qa.Fb([
                    { type: "1f", name: "u152", value: m[0] },
                    { type: "1f", name: "u153", value: m[1] },
                  ]);
              },
              cb: function (H) {
                function r() {
                  q && za.mb.toggle(!1);
                  M && C.j("s95", [{ type: "1f", name: "u109", value: 0 }]);
                }
                0 >= H
                  ? ((l = 0),
                    0 !== f &&
                      ((f = 0),
                      Yb.Sn(),
                      q && za.mb.toggle(!0),
                      M &&
                        C.j("s95", [{ type: "1f", name: "u109", value: 1 }])))
                  : 1 <= H
                  ? ((l = 1), 1 !== f && ((f = 1), Yb.Ij(!0)), r())
                  : ((l = H), 2 !== f && (Yb.Ij(!1), (f = 2), r()));
                C.j("s97", [{ type: "1f", name: "u121", value: 1 - H }]);
                var N = 1 - H;
                ka[0].value = l;
                ka[1].value = m[0] * N + -300 * H;
                ka[2].value = m[1] * N + -300 * H;
                ka[3].value = p * N + H * w;
                ka[4].value = F * N;
                ka[5].value = L * N;
                ka[6].value = N + H * h;
                u && za.ia.Ag(l, ka);
                A && za.ua.Ag(l, ka);
                Qa.Fb(ka);
              },
              Dl: function (H) {
                O.h(1);
                H.forEach(function (r) {
                  r.yl();
                });
                q && x.W();
              },
              Vm: function () {
                return 1 === f;
              },
              Je: function (H) {
                O.ya(H);
              },
              mk: function (H) {
                b.push(H);
              },
              Kg: function (H) {
                y = !H;
                u = H && I;
              },
              Jg: function (H) {
                g = H && k;
              },
              vg: function (H) {
                A && ha.ca() && za.ua.Co(H);
              },
              Gb: function (H) {
                ha.ca() && (I && za.ia.Gb(H), A && za.ua.Gb(H));
              },
              Al: function (H, r) {
                if (!G) return !1;
                e.J();
                H.h(0);
                C.set("s88");
                C.O("u14", 0, P);
                Y.l(!1, !1);
                n.u();
                e.h(0);
                C.O("u14", z, 0);
                Y.l(!1, !1);
                C.set("s89");
                r.J();
                n.h(0);
                Y.l(!1, !1);
                return !0;
              },
              Hj: function (H) {
                G = H && D;
              },
              resize: function (H, r, N) {
                D &&
                  ((H *= N),
                  (r *= N),
                  e.resize(H, r),
                  n.resize(H, r),
                  (z = 1 / H),
                  (P = 1 / r));
              },
              tg: function (H, r) {
                var N = H.P(),
                  ca = H.$(),
                  fa = { width: N, height: ca, isPot: !1 };
                I && (Q && Q.remove(), (Q = ba.instance(fa)));
                t && t.remove();
                t = Ea.instance({ width: N, height: ca });
                k || A
                  ? (za.rc.ug(N, ca), v && v.remove(), (v = ba.instance(fa)))
                  : (v = H);
                I && za.ia.ug(N, ca);
                r && (ia && ia.remove(), (ia = ba.instance(fa)));
              },
              wl: function (H) {
                var r = null;
                switch (f) {
                  case 0:
                    r = H;
                    break;
                  case 2:
                    t.bind(!1, !0);
                    ia.u();
                    C.set("s77");
                    C.C("u13", l);
                    H.h(1);
                    U.h(0);
                    Y.l(!0, !0);
                    r = ia;
                    break;
                  case 1:
                    r = U;
                }
                if (!u || 1 === f || !ha.ca()) return r;
                r.ya(0);
                g && za.rc.W(r, v);
                t.bind(!1, !g);
                A &&
                  (g ? r.h(0) : (v.u(), C.set("s1"), Y.l(!0, !0)), za.ua.W());
                v.h(0);
                X.ya(2);
                za.ia.W();
                Q.u();
                C.set("s1");
                g || A ? v.h(0) : r.h(0);
                Y.l(!0, !W.ga_);
                za.ia.add();
                return Q;
              },
              nk: function (H, r) {
                if (!u) return H;
                X.ya(2);
                za.ia.W();
                Ea.ba();
                C.set("s76");
                r.J();
                za.ia.om().h(0);
                Y.l(!0, !0);
                C.set("s1");
                c.enable(c.BLEND);
                c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA);
                H.h(0);
                Y.l(!1, !1);
                c.disable(c.BLEND);
                return r;
              },
              Bl: function (H, r) {
                if (!M) return !1;
                C.set("s95");
                C.C("u107", H * E);
                B.h(1);
                $a.Je(2);
                v ? v.h(3) : r.h(3);
                return !0;
              },
              A: function () {
                d = !1;
                l = f = 0;
                w = p = -1;
                h = 1;
                m = null;
                L = F = -1;
                q = !1;
                x = null;
                g = k = A = y = u = I = !1;
                za.ia.A();
                za.La.A();
              },
            };
          return Qa;
        })(),
        Ba = (function () {
          function a() {
            h.forEach(function (r) {
              r.El(v);
            });
          }
          function b() {
            h.forEach(function (r) {
              r.sd(v);
            });
          }
          function d() {
            h.forEach(function (r) {
              r.Cl(v);
            });
          }
          function f() {
            h.forEach(function (r) {
              r.td(v);
            });
          }
          function l() {
            v
              ? $a.Dl(h)
              : h.forEach(function (r) {
                  r.zl();
                });
          }
          function p() {
            E && clearTimeout(E);
            E = setTimeout(function () {
              e = !1;
              E = null;
            }, 16);
          }
          function w(r) {
            r();
          }
          var h = [],
            m = [],
            q = { ha: !1, position: !1, Cb: !1 },
            x = [],
            I = [],
            u = null,
            y = 0,
            A = null,
            k = null,
            g = null,
            F = null,
            L = !1,
            D = !1,
            G = !1,
            e = !1,
            n = !1,
            z = !1,
            P = null,
            B = null,
            E = null,
            M = null,
            t = !1,
            v = !1,
            Q = !1,
            X = !1,
            U = !0,
            ia = !1,
            O = !1,
            ka = null,
            Qa = null,
            H = {
              m: function () {
                c.enable(c.DEPTH_TEST);
                c.depthFunc(c.LEQUAL);
                c.clearDepth(1);
                W.il
                  ? (c.enable(c.CULL_FACE),
                    c.frontFace("CCW" === W.jl ? c.CCW : c.CW),
                    c.cullFace(c.BACK))
                  : c.disable(c.CULL_FACE);
                H.xh();
                var r = {
                  isPot: !1,
                  isLinear: !1,
                  width: ha.vb(),
                  height: ha.ub(),
                  L: 4,
                  isFloat: !1,
                };
                A = ba.instance(r);
                r = Object.assign({}, r, {
                  isLinear: !0,
                  width: ha.P(),
                  height: ha.$(),
                });
                k = ba.instance(r);
                g = ba.instance(r);
                W.Qa &&
                  ((r = Object.assign({}, r, { isLinear: !1 })),
                  (F = ba.instance(r)));
                z = Ia.ja();
                W.Qa ||
                  (u = pc.instance({ Lb: W.Lb, wc: W.wc, xc: W.xc, vc: W.vc }));
                L = !0;
              },
              xh: function () {
                ha.ca()
                  ? (q = tc.instance({}))
                  : ((q.ha = Ib.instance({
                      ic: W.Qa ? !1 : "s107",
                      isFloat: !1,
                      Vb: !0,
                      clearColor: [0, 0, 0, 0],
                      L: 4,
                    })),
                    (q.position = Ib.instance({
                      ic: W.Qa ? !1 : "s117",
                      isFloat: !0,
                      Vb: !0,
                      clearColor: [0, 0, 0, 0],
                      L: 4,
                    })),
                    (q.Cb = Ib.instance({
                      ic: !1,
                      isFloat: !0,
                      Vb: !0,
                      clearColor: [0, 0, 0, 0],
                      L: 4,
                    })),
                    (q.Pc = Ib.instance({
                      ic: !1,
                      isFloat: !1,
                      Vb: !0,
                      clearColor: [0, 0, 0, 0],
                      L: 4,
                    })));
              },
              dm: function () {
                return u;
              },
              ra: function (r) {
                u = r;
              },
              Zq: function () {},
              Gb: function (r) {
                $a.Gb(r);
              },
              pj: function (r) {
                $a.m(r, x);
                ha.ca() || (q.ha.Bj(!1), q.position.Bj("s110"));
                v = X = !0;
              },
              Fq: function () {
                $a.jj();
              },
              up: function (r) {
                $a.mk(r);
              },
              co: function (r, N, ca) {
                $a.eb(r, N, ca);
              },
              eo: function (r, N, ca) {
                $a.fb(r, N, ca);
              },
              ao: function (r, N) {
                $a.wj(r, N);
              },
              bo: function (r) {
                $a.qo(r);
              },
              fo: function (r) {
                $a.Aj(r);
              },
              cb: function (r) {
                $a.cb(r);
              },
              qj: function (r, N, ca, fa) {
                $a.yo(r, N, ca, fa);
                N && H.tg(N, fa ? !0 : !1);
                Q = !0;
              },
              Kg: function (r) {
                $a.Kg(r);
              },
              vg: function (r) {
                $a.vg(r);
              },
              Jg: function (r) {
                $a.Jg(r);
              },
              Hj: function (r) {
                $a.Hj(r);
              },
              vp: function (r) {
                t &&
                  ((O = !0),
                  ka && ka.remove(),
                  (ka = ba.instance({
                    width: M.P(),
                    height: M.$(),
                    isPot: !1,
                  })),
                  (Qa = r));
              },
              tg: function (r, N) {
                M =
                  "string" === typeof r
                    ? ba.instance({ url: r, isFloat: !1 })
                    : r;
                v && $a.tg(M, N);
                t = !0;
              },
              lk: function (r) {
                h.push(r);
                0 !== x.length &&
                  (x.forEach(function (N) {
                    N(r);
                  }),
                  x.splice(0, x.length));
              },
              Nn: function (r) {
                r = h.indexOf(r);
                -1 !== r && h.splice(r, 1);
              },
              wp: function (r) {
                m.push(r);
              },
              Cq: function (r) {
                r = m.indexOf(r);
                -1 !== r && m.splice(r, 1);
              },
              oe: function (r) {
                v && (D = r);
              },
              animate: function (r) {
                !W.Qa || (v && Q)
                  ? D &&
                    (e || (y > W.nn && n)
                      ? (P && clearTimeout(P),
                        ++y,
                        window.cancelAnimationFrame(H.animate),
                        (P = setTimeout(function () {
                          window.requestAnimationFrame(H.animate);
                        }, 16)))
                      : (H.ej(r),
                        ++y,
                        v || (D && window.requestAnimationFrame(H.animate))))
                  : setTimeout(H.animate, 100);
              },
              yp: function (r) {
                I.push(r);
              },
              ej: function (r) {
                if ((!W.Qa || (v && Q)) && L) {
                  I.forEach(w);
                  ha.ca()
                    ? q.set() || ha.na()
                      ? (v || Kc.Pn(), l(), q.M(), z && c.depthMask(!1))
                      : (ha.Qo(),
                        H.xh(),
                        Ib.ed(),
                        C.to(),
                        W.Qa && $a.jj(),
                        c.flush(),
                        window.requestAnimationFrame(H.animate))
                    : (v && $a.Je(1),
                      q.ha.set(!0, !0, !0),
                      b(),
                      q.ha.M(),
                      z && c.depthMask(!1),
                      q.Pc.set(!1, !z, !1),
                      d(),
                      q.Pc.M(),
                      q.position.set(!0, !z, !1),
                      xb.W(),
                      a(),
                      q.position.M(),
                      q.Cb.set(!1, !z, !1),
                      f(),
                      q.Cb.M());
                  c.disable(c.DEPTH_TEST);
                  z || c.depthMask(!1);
                  W.ga_ && Jb.W();
                  var N = H.Vh();
                  if (null !== N) {
                    N.h(7);
                    C.set(W.ga_ ? "s96" : "s97");
                    C.O("u14", 1 / ha.vb(), 1 / ha.ub());
                    Ib.Pk();
                    A.J();
                    ia
                      ? (c.enable(c.BLEND),
                        c.clearColor(0, 0, 0, 0),
                        c.clear(c.COLOR_BUFFER_BIT),
                        c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA),
                        C.C("u126", 1))
                      : c.disable(c.BLEND);
                    v || xb.df();
                    q.position.h(0);
                    q.Cb.h(1);
                    q.ha.h(2);
                    u.hd(3);
                    q.Pc.h(6);
                    u.jd(4);
                    u.Ch();
                    W.ga_ && Jb.h(5);
                    Y.l(!0, !0);
                    ia && C.C("u126", 0);
                    Ea.ba();
                    if (ia) {
                      c.disable(c.BLEND);
                      var ca = $a.nk(A, k);
                      C.set("s84");
                      g.J();
                      ca.h(0);
                      Y.l(!1, !1);
                      k.u();
                      g.h(0);
                      Y.l(!1, !1);
                      k.h(0);
                    } else
                      $a.Al(A, k) || (C.set("s1"), k.J(), A.h(0), Y.l(!1, !1)),
                        U
                          ? (C.set("s83"),
                            g.J(),
                            k.h(0),
                            Y.l(!1, !1),
                            k.u(),
                            g.h(0),
                            X && v
                              ? (C.set("s82"),
                                F.h(1),
                                $a.Je(2),
                                Y.l(!1, !1),
                                C.set("s1"),
                                F.J(),
                                k.h(0),
                                Y.l(!1, !1))
                              : (C.set("s81"), Y.l(!1, !1), k.h(0)))
                          : k.h(0);
                    Ea.aa();
                    c.viewport(0, 0, ha.P(), ha.$());
                    (!ia && v && $a.Bl(r, N)) || C.set("s1");
                    Y.l(!1, !1);
                    c.enable(c.DEPTH_TEST);
                    c.depthMask(!0);
                    c.flush();
                  }
                }
              },
              Vh: function () {
                if (!t || ia) return ba.ii();
                if (!v) return M;
                if (O && !$a.Vm()) {
                  C.set(Qa);
                  Ea.ba();
                  ka.Wc();
                  ka.u();
                  M.h(0);
                  var r = ka;
                  Y.l(!0, !0);
                } else r = M;
                return $a.wl(r);
              },
              Vq: function () {
                W.nl ||
                  D ||
                  ((D = !0),
                  H.animate(Date.now()),
                  G || Gc.Lo(),
                  G || Yb.ib(!1),
                  B && clearTimeout(B),
                  W.ga_ && Jb.ge(),
                  (B = setTimeout(H.va, W.Lk)),
                  G || ha.xm(),
                  (G = !0));
              },
              Wq: function () {
                D && ((n = D = !1), cancelAnimationFrame(H.animate));
              },
              va: function () {
                n ||
                  !G ||
                  e ||
                  W.zh ||
                  ((n = e = !0),
                  B && clearTimeout(B),
                  E && clearTimeout(E),
                  xb.lf().gj(),
                  (B = setTimeout(function () {
                    ha.Xg(W.tn);
                    W.ga_ && Jb.Wj();
                    y = 0;
                    p();
                  }, 24)));
              },
              wake: function () {
                n &&
                  G &&
                  !e &&
                  ((e = !0),
                  (n = !1),
                  (y = 0),
                  xb.lf().gj(),
                  B && clearTimeout(B),
                  E && clearTimeout(E),
                  (B = setTimeout(function () {
                    ha.Xg(1);
                    W.ga_ && Jb.ge();
                    p();
                  }, 16)));
              },
              hq: function () {},
              Np: function () {},
              me: function (r) {
                X = r;
              },
              Yq: function (r) {
                U = r;
              },
              Jj: function (r) {
                ia = r;
              },
              cr: function () {
                C.j("s97", [
                  { type: "1f", name: "u124", value: W.Rc },
                  { type: "1f", name: "u125", value: W.jg },
                ]);
              },
              resize: function (r, N, ca) {
                A.resize(r * ca, N * ca);
                k.resize(r, N);
                g.resize(r, N);
                W.Qa && F.resize(r, N);
                $a.resize(r, N, ca);
                r = [{ type: "2f", name: "u14", value: [1 / r, 1 / N] }];
                C.j("s83", r);
                C.j("s81", r);
                C.j("s84", r);
              },
              I: function () {
                P && clearTimeout(P);
                B && clearTimeout(B);
                E && clearTimeout(E);
                h.concat(m).forEach(function (r) {
                  r.I();
                });
                h.splice(0, h.length);
                m.splice(0, m.length);
                q.ha.remove();
                q.Cb.remove();
                q.Pc.remove();
                q.position.remove();
                A.remove();
                k.remove();
                g.remove();
                F && F.remove();
                e = !0;
              },
              A: function () {
                H.I();
                z = n = e = G = D = v = Q = e = !1;
              },
            };
          return H;
        })(),
        za = {},
        ha = (function () {
          function a() {
            Ib.resize(d * m, f * m);
            A.ca() && tc.resize(d * m, f * m);
            Ba.resize(d, f, m);
            W.ga_ && Jb.resize(d * m, f * m, m);
            A.Vg();
          }
          var b = null,
            d = 0,
            f = 0,
            l = -1,
            p = !1,
            w = {
              qe: !1,
              Ng: !1,
              Tj: !1,
              Gg: !1,
              drawBuffers: !1,
              Om: !1,
              zi: !1,
              Qm: !1,
              Gf: !1,
              Za: !1,
            },
            h = Object.assign({}, w),
            m = 1,
            q = !1,
            x = !1,
            I = !1,
            u = !1,
            y = !1,
            A = {
              m: function (k) {
                void 0 !== k.onload && k.onload && (x = k.onload);
                void 0 === k.expand && (k.expand = !1);
                void 0 === k.Id && (k.Id = !1);
                void 0 === k.sa && (k.sa = !1);
                void 0 === k.Rb && (k.Rb = !1);
                void 0 === k.alpha && (k.alpha = !1);
                void 0 === k.preserveDrawingBuffer &&
                  (k.preserveDrawingBuffer = !1);
                k.Id && (p = !0);
                b = k.sa ? k.sa : document.getElementById(k.cl);
                k.expand && A.expand();
                try {
                  c = k.Rb
                    ? k.Rb.Ql()
                    : b.getContext("webgl", {
                        antialias: !1,
                        alpha: k.alpha,
                        depth: !0,
                        premultipliedAlpha: !1,
                        stencil: !1,
                        preserveDrawingBuffer: k.preserveDrawingBuffer,
                      });
                  window.gk || (window.gk = c);
                  u = k.Rb ? k.Rb.na() : !1;
                  I = !u;
                  8 > c.getParameter(c.MAX_TEXTURE_IMAGE_UNITS) &&
                    A.pd("too few texture image units");
                  if (!Ia.m()) return A.pd("invalid config");
                  W.Xo &&
                    ((h.Ng = c.getExtension("EXT_texture_filter_anisotropic")),
                    h.Ng && (h.zi = !0));
                  W.Yo &&
                    ((h.qe = c.getExtension("WEBGL_compressed_texture_s3tc")),
                    h.qe &&
                      void 0 !== h.qe.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                      h.qe.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                      (h.Om = !0));
                  I &&
                    ((h.Tj =
                      c.getExtension("OES_element_index_uint") ||
                      c.getExtension("MOZ_OES_element_index_uint") ||
                      c.getExtension("WEBKIT_OES_element_index_uint")),
                    h.Tj && (h.Qm = !0));
                  !u &&
                    W.Zo &&
                    ((h.Gg = c.getExtension("EXT_sRGB")), h.Gg && (h.Gf = !0));
                  I
                    ? ((h.drawBuffers = c.getExtension("WEBGL_draw_buffers")),
                      h.drawBuffers && !W.yh && (h.Za = !0))
                    : (h.Za = 4 <= c.getParameter(c.MAX_DRAW_BUFFERS));
                  if (h.Za) {
                    var g = A.pl();
                    h.Za = h.Za && g;
                  }
                } catch (F) {
                  return A.pd(F);
                }
                if (null === c || !c) return A.pd("NO_GL");
                k.expand && window.addEventListener("resize", A.expand, !1);
                b.addEventListener(
                  "contextmenu",
                  function (F) {
                    F.preventDefault();
                    return !1;
                  },
                  !1
                );
                d = b.width;
                f = b.height;
                A.Cf();
                return !0;
              },
              Cf: function () {
                l = p ? 3 : 2;
                Ia.ja() || (l = Math.min(l, 1));
                Ia.Zk() || (l = Math.min(l, 0));
                Uc.m();
                Ib.m();
                for (var k in za) za[k].Sc();
                C.m();
                xb.m();
                Yb.m();
                Ba.m();
                Gc.m();
                W.ga_ && Jb.m();
                A.Vg();
                A.rl();
                q = !0;
                x && x();
                return !0;
              },
              rl: function () {
                if (h.Za) {
                  var k = tc.instance({ width: 256, height: 1 });
                  k.bind();
                  c.viewport(0, 0, 256, 1);
                  C.set("s105");
                  C.Ba("color", [1, 0, 0, 1]);
                  Y.l(!0, !0);
                  c.clearColor(0, 0, 0, 0);
                  c.clear(c.COLOR_BUFFER_BIT || c.DEPTH_BUFFER_BIT);
                  Ea.aa();
                  C.set("s1");
                  k.Cb.h(0);
                  Y.l(!1, !1);
                  k = new Uint8Array(1024);
                  c.readPixels(0, 0, 256, 1, c.RGBA, c.UNSIGNED_BYTE, k);
                  y = 1 >= k[1020];
                }
              },
              pl: function () {
                var k = tc.instance({ width: 1, height: 1 });
                if (!k.set()) return k.remove(), !1;
                C.wo(c);
                Y.Qb(c);
                c.bindFramebuffer(c.FRAMEBUFFER, null);
                C.Eb(c);
                k.ha.ya(0);
                Y.Qb(c);
                var g = new Uint8Array(4);
                c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, g);
                k.remove();
                return 3 < Math.abs(g[0] - 127) ? !1 : !0;
              },
              na: function () {
                return u;
              },
              P: function () {
                return d;
              },
              $: function () {
                return f;
              },
              vb: function () {
                return m * A.P();
              },
              ub: function () {
                return m * A.$();
              },
              Rl: function () {
                return d / f;
              },
              X: function () {
                return l;
              },
              pq: function () {
                return 3 === l;
              },
              zb: function () {
                return q;
              },
              Ci: function () {
                return y;
              },
              ca: function () {
                return h.Za;
              },
              Qo: function () {
                h.Za = !1;
              },
              sq: function () {
                return !1;
              },
              al: function () {
                return 0 < A.X();
              },
              Ep: function () {
                return A.ca() && 0 < A.X();
              },
              kf: function (k) {
                var g = c,
                  F = "";
                u || ((g = h.drawBuffers), (F = "_WEBGL"));
                return [
                  g["COLOR_ATTACHMENT0" + F],
                  g["COLOR_ATTACHMENT1" + F],
                  g["COLOR_ATTACHMENT2" + F],
                  g["COLOR_ATTACHMENT3" + F],
                ].splice(0, k);
              },
              zd: function (k) {
                return A.kf(4)[k];
              },
              sm: function () {
                return u
                  ? c.SRGB
                    ? c.SRGB
                    : c.RGBA
                  : h.Gf
                  ? h.Gg.SRGB_ALPHA_EXT
                  : c.RGBA;
              },
              Rm: function () {
                return h.zi;
              },
              Wl: function () {
                return h.Ng;
              },
              en: function (k) {
                A.na()
                  ? c.drawBuffers(A.kf(k))
                  : h.drawBuffers.drawBuffersWEBGL(A.kf(k));
              },
              expand: function () {
                Ba.wake();
                A.resize(window.innerWidth, window.innerHeight);
                Ba.va();
              },
              resize: function (k, g) {
                !b ||
                  (k === d && g === f) ||
                  ((d = k),
                  (f = g),
                  (b.width = d),
                  (b.height = f),
                  q && (xb.resize(), a()));
              },
              Vg: function () {
                var k = [
                  {
                    type: "2f",
                    name: "u14",
                    value: [1 / ha.vb(), 1 / ha.ub()],
                  },
                ];
                C.j("s83", k);
                C.j("s81", k);
              },
              Xg: function (k) {
                m = k;
                a();
              },
              Ma: function (k, g) {
                b.addEventListener(k, g, !1);
              },
              pd: function () {
                l = -1;
                return !1;
              },
              sh: function () {
                return 0 <= l;
              },
              vq: function () {},
              Gq: function () {},
              Tq: function () {
                var k = document.getElementById("loading");
                k && (k.style.display = "block");
              },
              xm: function () {
                var k = document.getElementById("loading");
                k && (k.style.display = "none");
              },
              I: function () {
                A.sh() &&
                  (ba.Uj(),
                  Ba.I(),
                  Y.I(),
                  Ib.I(),
                  W.ga_ && Jb.I(),
                  pc.I(),
                  Gc.I(),
                  C.I(),
                  ba.I(),
                  c.flush(),
                  (c = null));
              },
              A: function () {
                Ba.A();
                $a.A();
                C.A();
                tc.A();
                Ib.A();
                Object.assign(h, w);
                q = I = !1;
              },
            };
          return A;
        })(),
        xb = (function () {
          var a = !1,
            b = !1,
            d = [];
          return {
            m: function () {},
            instance: function (f) {
              void 0 === f.hj && (f.hj = !0);
              void 0 === f.Ee && (f.Ee = 0.1);
              void 0 === f.De && (f.De = 100);
              void 0 === f.direction && (f.direction = [0, 0, -1]);
              void 0 === f.Uh && (f.Uh = 45);
              var l = new gc(),
                p = new Za(50, -50, -400),
                w = null;
              l.setPosition(p);
              var h = new Int8Array(20),
                m = new Int8Array(20),
                q = 0,
                x = 0,
                I = 0,
                u = 0,
                y = {
                  W: function () {
                    m[C.Ad()] || (C.Vc("u127", l.elements), (m[C.Ad()] = 1));
                    h[C.Ad()] || (C.Vc("u139", w), (h[C.Ad()] = 1));
                  },
                  cf: function () {
                    x || (C.Vc("u127", l.elements), (x = 1));
                    q || (C.O("u128", w[0], w[5]), (q = 1));
                  },
                  df: function () {
                    I || (C.Cg("u116", p.x, p.y, p.z), (I = 1));
                  },
                  Nb: function () {
                    u || (C.Cg("u157", p.x, p.y, p.z), (u = 1));
                  },
                  uh: function () {
                    var A = f.Ee,
                      k = f.De,
                      g = Math.tan((0.5 * f.Uh * Math.PI) / 180);
                    w = [
                      0.5 / g,
                      0,
                      0,
                      0,
                      0,
                      (0.5 * ha.Rl()) / g,
                      0,
                      0,
                      0,
                      0,
                      -(k + A) / (k - A),
                      -1,
                      0,
                      0,
                      (-2 * k * A) / (k - A),
                      0,
                    ];
                    for (A = 0; 20 > A; ++A) h[A] = 0;
                    q = 0;
                  },
                  ro: function (A, k) {
                    p.nj(k[0]).oj(k[1]).z = k[2];
                    l.elements.set(A);
                    for (A = 0; 20 > A; ++A) m[A] = 0;
                    u = I = x = 0;
                  },
                  gj: function () {
                    for (var A = (u = I = 0); 20 > A; ++A) m[A] = 0;
                  },
                };
              y.uh();
              a = y;
              b = !0;
              f.hj && d.push(y);
              return y;
            },
            W: function () {
              b && a.W();
            },
            cf: function () {
              b && a.cf();
            },
            df: function () {
              b && a.df();
            },
            Nb: function () {
              b && a.Nb();
            },
            resize: function () {
              d.forEach(function (f) {
                f.uh();
              });
            },
            lf: function () {
              return a;
            },
          };
        })(),
        Ib = (function () {
          var a = [],
            b = null;
          return {
            m: function () {
              b = Ea.instance({
                width: ha.vb(),
                height: ha.ub(),
                Hc: !ha.ca(),
              });
            },
            instance: function (d) {
              void 0 === d.width && (d.width = ha.vb());
              void 0 === d.height && (d.height = ha.ub());
              void 0 === d.isFloat && (d.isFloat = !1);
              void 0 === d.Vb && (d.Vb = !1);
              void 0 === d.clearColor && (d.clearColor = [0, 0, 0, 0]);
              void 0 === d.L && (d.L = 4);
              var f = ba.instance({
                  isFloat: d.isFloat && Ia.ja(),
                  U: d.isFloat,
                  width: d.width,
                  height: d.height,
                  isPot: !1,
                  isLinear: !1,
                  L: d.L,
                }),
                l = void 0 !== d.ic && d.ic ? !0 : !1,
                p = d.ic,
                w = {
                  set: function (h, m, q) {
                    q && b.bind(!1, q);
                    f.u();
                    h &&
                      (c.clearColor(
                        d.clearColor[0],
                        d.clearColor[1],
                        d.clearColor[2],
                        d.clearColor[3]
                      ),
                      b.Qe());
                    m && b.th();
                    l && C.set(p);
                  },
                  Bj: function (h) {
                    l = (p = h) ? !0 : !1;
                  },
                  M: function () {
                    f.se();
                  },
                  h: function (h) {
                    f.h(h);
                  },
                  resize: function (h, m) {
                    f.resize(h, m);
                  },
                  debug: function () {
                    f.debug();
                  },
                  remove: function () {
                    f.remove();
                  },
                };
              d.Vb && a.push(w);
              return w;
            },
            resize: function (d, f) {
              b.resize(d, f);
              a.forEach(function (l) {
                l.resize(d, f);
              });
            },
            Pk: function () {
              b.mh();
            },
            ed: function () {
              b.ed();
            },
            Wc: function () {
              b.Wc();
            },
            Hp: function () {
              b.th();
            },
            Gp: function () {
              b.Qe();
            },
            Fp: function () {
              b.clear();
            },
            I: function () {
              b.remove();
            },
            A: function () {
              b.remove();
              a.forEach(function (d) {
                d.remove();
              });
              a.splice(0);
            },
          };
        })(),
        tc = (function () {
          var a = [];
          return {
            instance: function (b) {
              void 0 === b.width && (b.width = ha.vb());
              void 0 === b.height && (b.height = ha.ub());
              var d = c.createFramebuffer(),
                f = b.width,
                l = b.height,
                p = !0;
              b = {
                isFloat: Ia.ja(),
                U: !0,
                width: f,
                height: l,
                isPot: !1,
                isLinear: !1,
                L: 4,
              };
              var w = ba.instance(b),
                h = ba.instance(b),
                m = ba.instance(b),
                q = ba.instance(b),
                x = Ea.Xl(),
                I = Ea.$h();
              c.bindFramebuffer(x, d);
              var u = c.createRenderbuffer();
              c.bindRenderbuffer(c.RENDERBUFFER, u);
              c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, f, l);
              c.framebufferRenderbuffer(
                x,
                c.DEPTH_ATTACHMENT,
                c.RENDERBUFFER,
                u
              );
              c.clearDepth(1);
              c.framebufferTexture2D(x, ha.zd(0), c.TEXTURE_2D, w.get(), 0);
              c.framebufferTexture2D(x, ha.zd(1), c.TEXTURE_2D, h.get(), 0);
              c.framebufferTexture2D(x, ha.zd(2), c.TEXTURE_2D, q.get(), 0);
              c.framebufferTexture2D(x, ha.zd(3), c.TEXTURE_2D, m.get(), 0);
              ha.en(4);
              c.bindFramebuffer(x, null);
              Ea.reset();
              var y = {
                position: w,
                Cb: h,
                Pc: m,
                ha: q,
                bind: function () {
                  c.bindFramebuffer(x, d);
                  Ea.reset();
                },
                set: function () {
                  p && c.checkFramebufferStatus(I);
                  c.bindFramebuffer(x, d);
                  Ea.reset();
                  if (p) {
                    if (c.checkFramebufferStatus(I) !== c.FRAMEBUFFER_COMPLETE)
                      return !1;
                    p = !1;
                  }
                  c.viewport(0, 0, f, l);
                  c.clearColor(0, 0, 0, 0);
                  C.zb() && !ha.Ci() && (C.set("s104"), Y.l(!1, !1));
                  c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                  return !0;
                },
                M: function () {},
                resize: function (A, k) {
                  f = A;
                  l = k;
                  w.resize(A, k);
                  h.resize(A, k);
                  q.resize(A, k);
                  m.resize(A, k);
                  c.bindRenderbuffer(c.RENDERBUFFER, u);
                  c.renderbufferStorage(
                    c.RENDERBUFFER,
                    c.DEPTH_COMPONENT16,
                    f,
                    l
                  );
                  c.bindRenderbuffer(c.RENDERBUFFER, null);
                },
                remove: function () {
                  w.remove();
                  h.remove();
                  q.remove();
                  m.remove();
                  c.deleteRenderbuffer(u);
                  c.deleteFramebuffer(d);
                  var A = a.indexOf(y);
                  -1 !== A && a.splice(A, 1);
                },
              };
              a.push(y);
              return y;
            },
            resize: function (b, d) {
              a.forEach(function (f) {
                f.resize(b, d);
              });
            },
            A: function () {
              a.forEach(function (b) {
                b.remove();
              });
              a.splice(0);
            },
          };
        })(),
        pc = (function () {
          var a = [],
            b = W.kh;
          return {
            instance: function (d) {
              function f() {
                m
                  ? l()
                  : ((q = ce.instance({ V: u.pb, Nm: b })),
                    (h = W.Mk[ha.X()]),
                    (u.yb = ba.instance({
                      isFloat: Ia.ja(),
                      U: !0,
                      isPot: !0,
                      isLinear: !1,
                      isMirrorY: !0,
                      width: h,
                      height: h / 2,
                      L: 3,
                    })),
                    (u.Jd = ba.instance({
                      isFloat: Ia.ja(),
                      U: !0,
                      isPot: !0,
                      isLinear: !1,
                      isMirrorY: !0,
                      width: h,
                      height: h / 2,
                      L: 3,
                    })),
                    (u.Qd = ba.instance({
                      isFloat: Ia.ja(),
                      U: !0,
                      isPot: !0,
                      width: 1,
                      height: h / 2,
                      L: 3,
                    })),
                    (u.Kd = ba.instance({
                      isFloat: Ia.ja() && !b,
                      U: !b,
                      isPot: !1,
                      isLinear: !0,
                      isMirrorY: !0,
                      isMipmap: !1,
                      width: h,
                      height: h / 2,
                      L: b ? 4 : 3,
                    })),
                    (m = !0),
                    l(),
                    I.forEach(function (y) {
                      y();
                    }),
                    I.splice(0, I.length));
              }
              function l() {
                if (m) {
                  Ea.ba();
                  q.ko(u.pb);
                  q.Ln();
                  u.yb.J();
                  C.set("s87");
                  u.pb.h(0);
                  C.C("u91", W.Rc);
                  ba.Uk(1);
                  Y.l(!0, !0);
                  for (var y = W.Em[ha.X()], A = 0; A < y; ++A)
                    u.Jd.u(),
                      C.set("s90"),
                      C.O("u14", 1 / h, 0),
                      u.yb.h(0),
                      Y.l(!1, !1),
                      u.yb.u(),
                      C.O("u14", 0, 2 / h),
                      u.Jd.h(0),
                      Y.l(!1, !1);
                  u.Qd.J();
                  C.set("s92");
                  u.yb.h(0);
                  Y.l(!1, !1);
                  C.set(b ? "s94" : "s93");
                  u.Kd.J();
                  u.yb.h(0);
                  u.Qd.h(1);
                  Y.l(!1, !1);
                  ba.aa(0);
                  ba.aa(1);
                }
              }
              var p = Object.assign({ Lb: null, wc: null, vc: 0, xc: 0 }, d),
                w = 0,
                h = 0,
                m = !1,
                q = null,
                x = 0,
                I = [],
                u = {
                  xd: null,
                  pa: null,
                  pb: null,
                  yb: null,
                  Jd: null,
                  Kd: null,
                  Qd: null,
                };
              d = {
                m: function () {
                  function y() {
                    2 === ++A &&
                      ((u.pb = ba.instance({
                        isFloat: Ia.ja(),
                        U: !0,
                        isPot: !1,
                        isLinear: !0,
                        width: w,
                        height: w / 2,
                        L: 3,
                      })),
                      Ea.ba(),
                      u.pb.J(),
                      C.set("s86"),
                      C.C("u99", p.xc),
                      C.C("u100", p.vc),
                      u.xd.h(0),
                      u.pa.h(1),
                      Y.l(!0, !0),
                      f());
                  }
                  var A = 0;
                  w = W.Nk[ha.X()];
                  x = Math.log2(w) - 1;
                  p.Lb &&
                    ((u.xd = ba.instance({
                      isPot: !1,
                      url: p.Lb,
                      D: y,
                      L: 3,
                      isFlipY: !1,
                    })),
                    (u.pa = ba.instance({
                      isPot: !1,
                      url: p.wc,
                      D: y,
                      L: 3,
                      isFlipY: !1,
                    })));
                },
                wg: function (y) {
                  u.pb = y;
                  f();
                },
                hd: function (y) {
                  m && (q.h(y), C.C("u117", q.P()));
                },
                jd: function (y) {
                  m && u.Kd.h(y);
                },
                Ch: function () {
                  C.C("u3", x);
                },
                Wh: function () {
                  return x;
                },
                P: function () {
                  return w;
                },
                zc: function (y) {
                  m ? y() : I.push(y);
                },
                I: function () {
                  u.xd && u.xd.remove();
                  u.pa && u.pa.remove();
                  u.yb.remove();
                  u.Qd.remove();
                  u.Jd.remove();
                  q.remove();
                  u.Kd.remove();
                  u.pb.remove();
                },
              };
              a.push(d);
              d.m();
              return d;
            },
            I: function () {
              a.forEach(function (d) {
                d.I();
              });
            },
          };
        })(),
        Jd = {
          instance: function (a) {
            var b = a.Zm,
              d = a.Xm,
              f = 0,
              l = b.P();
            a = W.kh;
            var p = ba.instance({
                isFloat: Ia.ja() && !a,
                U: !a,
                isLinear: !0,
                isMipmap: !1,
                isPot: !1,
                width: l,
                L: a ? 4 : 3,
                isFlipY: !1,
              }),
              w = ba.instance({
                isFloat: Ia.ja() && !a,
                U: !a,
                isPot: !1,
                isLinear: !0,
                kq: !0,
                isMipmap: !1,
                width: l,
                height: l / 2,
                L: a ? 4 : 3,
              }),
              h = Ea.instance({ width: l, height: l }),
              m = a ? "s78" : "s77";
            return {
              xo: function (q) {
                f = q;
                C.set(m);
                c.viewport(0, 0, l, l);
                h.u();
                p.u();
                C.C("u13", f);
                b.hd(1);
                d.hd(0);
                Y.l(!0, !0);
                c.viewport(0, 0, l, l / 2);
                w.u();
                b.jd(1);
                d.jd(0);
                Y.l(!1, !1);
                c.flush();
              },
              hd: function (q) {
                p.h(q);
              },
              jd: function (q) {
                w.h(q);
              },
              Ch: function () {
                C.C("u3", b.Wh() * (1 - f) + d.Wh() * f);
              },
            };
          },
        },
        Yb = (function () {
          function a(M) {
            var t = (e - W.Oe) / (W.ph - W.Oe);
            t = 1 - Math.pow(1 - t, W.rp);
            e += M * (1 + t * W.sp);
            e = Math.min(Math.max(e, W.Oe), W.ph);
            E.ib();
          }
          function b(M) {
            -1 !== h &&
              ((F = g = 0),
              w(),
              a((W.pp * M.deltaY) / window.innerHeight),
              M.preventDefault());
          }
          function d() {
            D += g;
            G += F;
            G = Math.min(Math.max(G, W.xn), W.wn);
            E.ib();
          }
          function f(M) {
            if (0 === h || -1 === h) return !1;
            var t = void 0 !== M.touches && M.touches.length;
            M.preventDefault();
            if (2 === h) {
              var v = qd(
                M.touches[0].pageX,
                M.touches[0].pageY,
                M.touches[1].pageX,
                M.touches[1].pageY
              );
              a(-(A - v) * W.yn);
              A = v;
            } else
              (v = t ? M.touches[0].clientX : M.clientX),
                (M = t ? M.touches[0].clientY : M.clientY),
                (g = (2 * (v - u) * Math.PI) / ha.P()),
                (F = (2 * (M - y) * Math.PI) / ha.$()),
                4 === h
                  ? ((B[0] += g * W.Ui),
                    (B[1] -= F * W.Ui),
                    (B[0] = Math.min(Math.max(B[0], -W.Xi), W.Xi)),
                    (B[1] = Math.min(Math.max(B[1], -W.Yi), W.Yi)),
                    E.ib())
                  : d(),
                (u = v),
                (y = M);
          }
          function l() {
            0 !== h &&
              -1 !== h &&
              ((0 === g && 0 === F) || 1 !== h || !z
                ? Ba.va()
                : (w(), (k = Date.now()), (n = setInterval(E.Wm, L))),
              (h = 0));
          }
          function p(M) {
            if (2 !== h && -1 !== h) {
              F = g = 0;
              w();
              Ba.wake();
              var t = void 0 !== M.changedTouches && M.touches.length;
              M.preventDefault();
              t && 2 === M.touches.length
                ? ((h = 2),
                  (A = qd(
                    M.touches[0].pageX,
                    M.touches[0].pageY,
                    M.touches[1].pageX,
                    M.touches[1].pageY
                  )))
                : ((h = t || 2 !== M.button ? 1 : 4),
                  (u = t ? M.touches[0].clientX : M.clientX),
                  (y = t ? M.touches[0].clientY : M.clientY));
              return !1;
            }
          }
          function w() {
            n && (clearInterval(n), (n = !1));
          }
          var h = 0,
            m = !1,
            q = !1,
            x = !1,
            I = 1,
            u = 0,
            y = 0,
            A = 0,
            k = 0,
            g = 0,
            F = 0,
            L = 16,
            D = W.Oj,
            G = W.Wi,
            e = W.Ne,
            n = !1,
            z = 0,
            P = new Float32Array([0, 0, 0, 0, 0]),
            B = [W.Xk, W.Yk],
            E = {
              m: function () {
                z = W.qk[ha.X()];
                L = W.ud[ha.X()];
                ha.Ma("mousedown", p);
                ha.Ma("mouseup", l);
                ha.Ma("mouseout", l);
                ha.Ma("mousemove", f);
                ha.Ma("mousemove", f);
                ha.Ma("wheel", b);
                ha.Ma("touchstart", p);
                ha.Ma("touchend", l);
                ha.Ma("touchmove", f);
              },
              ib: function (M) {
                m
                  ? ((q[0] = -G),
                    (q[1] = D),
                    (x[1].value = (I / W.Ne) * e),
                    $a.Fb(x))
                  : ((P[0] = D),
                    (P[1] = G),
                    (P[2] = e),
                    (P[3] = B[0]),
                    (P[4] = B[1]),
                    Gc.Zn(P, M));
              },
              Wm: function () {
                if ((1e-4 > g && 1e-4 > F) || -1 === h)
                  w(), (F = g = 0), 0 === h && Ba.va();
                var M = Date.now(),
                  t = M - k;
                k = M;
                M = Math.pow(z, t / L);
                g *= M;
                F *= M;
                d();
              },
              ef: function (M) {
                m ||
                  ((m = !0),
                  (h = -1),
                  (q = [0, 0, 0]),
                  (x = [
                    { name: "u84", type: "3f", value: q },
                    { name: "u88", type: "1f", value: 1 },
                  ]),
                  (I = M));
              },
              Ij: function (M) {
                -1 === h && M && (h = 0);
                M || (h = -1);
              },
              Sn: function () {
                F = g = 0;
                D = W.Oj;
                G = W.Wi;
                e = W.Ne;
                E.ib();
              },
              Kq: function (M) {
                e = M;
              },
              Lq: function (M) {
                B[0] = M[0];
                B[1] = M[1];
                W.qh = M[2];
              },
              Jq: function (M, t) {
                D = M;
                G = t;
              },
            };
          return E;
        })(),
        Kc = (function () {
          var a = {
            s106: !1,
            s106color: !1,
            s106NormalMap: !1,
            s106ParamsMap: !1,
            s106NormalParamsMap: !1,
          };
          return {
            instance: function (b) {
              function d(r) {
                if (!H) return Promise.reject("REMOVED");
                y.ld && y.ld(r);
                M = r.partsNames || [];
                E.splice(0);
                E.push({ n: 0, offset: 0 });
                z.min.set(Infinity, Infinity, Infinity);
                z.max.set(-Infinity, -Infinity, -Infinity);
                var N = r.uvs;
                N &&
                  (N = N.filter(function (Ta) {
                    return Ta;
                  }));
                O = N && 0 < N.length && 0 < N[0].length ? !0 : !1;
                var ca = r.normals && r.normals.length ? !0 : !1;
                "undefined" !== typeof ac &&
                  "string" === typeof r.faces &&
                  (r.faces = ac(r.faces));
                "undefined" !== typeof Mb &&
                  ("string" === typeof r.vertices &&
                    (r.vertices = Mb(r.vertices)),
                  ca &&
                    "string" === typeof r.normals &&
                    (r.normals = Mb(r.normals)),
                  N &&
                    N.length &&
                    N.forEach(function (Ta, Va) {
                      "string" === typeof Ta && (N[Va] = Mb(Ta));
                    }));
                var fa = r.metadata.faces,
                  ma = 1 + (O ? 1 : 0);
                fa = (r.faces.length - fa) / (r.metadata.faces * ma);
                (6 !== fa && 8 !== fa) || O || (++ma, (fa /= 2));
                if (4 === fa) {
                  fa = 6 * ma + 2;
                  for (
                    var ya = 4 * ma + 1,
                      qa = Array(r.metadata.faces * fa),
                      oa = 0;
                    oa < r.metadata.faces;
                    ++oa
                  )
                    for (var la = 0; la < ma; ++la)
                      (qa[oa * fa + 4 * la] = r.faces[oa * ya + 5 * la]),
                        (qa[oa * fa + 4 * la + 1] =
                          r.faces[oa * ya + 5 * la + 1]),
                        (qa[oa * fa + 4 * la + 2] =
                          r.faces[oa * ya + 5 * la + 2]),
                        0 === la && (qa[oa * fa + 3] = r.faces[oa * ya + 4]),
                        (qa[oa * fa + 4 * la + 3 * ma + 1] =
                          r.faces[oa * ya + 5 * la]),
                        (qa[oa * fa + 4 * la + 3 * ma + 2] =
                          r.faces[oa * ya + 5 * la + 2]),
                        (qa[oa * fa + 4 * la + 3 * ma + 3] =
                          r.faces[oa * ya + 5 * la + 3]),
                        0 === la &&
                          (qa[oa * fa + 3 * ma + 4] = r.faces[oa * ya + 4]);
                  r.faces = qa;
                  r.metadata.faces *= 2;
                }
                fa = r.metadata.vertices;
                A = Array(fa);
                for (ya = 0; ya < fa; ++ya)
                  (A[ya] = new Za(
                    r.vertices[3 * ya],
                    r.vertices[3 * ya + 1],
                    r.vertices[3 * ya + 2]
                  )),
                    Od(z, A[ya]);
                fa = r.metadata.faces;
                k = Array(fa);
                ma = 3 * ma + 1;
                for (ya = 0; ya < fa; ++ya)
                  (k[ya] = new Qc(
                    r.faces[ma * ya],
                    r.faces[ma * ya + 1],
                    r.faces[ma * ya + 2]
                  )),
                    (k[ya].$b = r.faces[ma * ya + 3]);
                if (ca)
                  for (
                    ca = r.metadata.normals, g = Array(ca), ma = 0;
                    ma < ca;
                    ++ma
                  )
                    g[ma] = new Za(
                      r.normals[3 * ma],
                      r.normals[3 * ma + 1],
                      r.normals[3 * ma + 2]
                    );
                else Rd(A, k), (g = Sd(A, k));
                v = 3 < A.length;
                H && (H.visible = v);
                if (O) {
                  ca = Array(A.length);
                  ma = ["a", "b", "c"];
                  for (fa = 0; fa < r.metadata.faces; ++fa)
                    for (ya = 0; 3 > ya; ++ya)
                      if (
                        ((qa = r.faces[7 * fa + ya]),
                        (oa = r.faces[7 * fa + 1 + ya + 3]),
                        "undefined" === typeof ca[qa])
                      )
                        ca[qa] = [[qa, oa]];
                      else if (ca[qa][0][1] !== oa) {
                        la = -1;
                        for (var T = 1; T < ca[qa].length; ++T)
                          if (ca[qa][T][1] === oa) {
                            la = ca[qa][T][0];
                            break;
                          }
                        T = -1;
                        -1 === la
                          ? ((T = A.length),
                            A.push(A[qa].clone()),
                            g.push(g[qa].clone()),
                            ca[qa].push([T, oa]),
                            (ca[T] = [[T, oa]]))
                          : (T = la);
                        r.faces[7 * fa + ya] = T;
                        k[fa][ma[ya]] = T;
                      }
                  F = Array(A.length);
                  for (r = 0; r < A.length; ++r)
                    (ma = "undefined" === typeof ca[r] ? r : ca[r][0][1]),
                      (F[r] = new ec(N[0][2 * ma], N[0][2 * ma + 1]));
                }
                var ta = Fc(z);
                y.ih &&
                  (A.forEach(function (Ta) {
                    Ta.x -= ta.x;
                    Ta.z -= ta.z;
                    Ta.y -= z.min.y;
                  }),
                  (z.min.x -= ta.x),
                  (z.max.x -= ta.x),
                  (z.min.z -= ta.z),
                  (z.max.z -= ta.z),
                  (z.max.y -= z.min.y),
                  (z.min.y = 0));
                if (y.jh) {
                  var Ha =
                    W.Kk /
                    Math.max(
                      z.max.x - z.min.x,
                      z.max.y - z.min.y,
                      z.max.z - z.min.z
                    );
                  A.forEach(function (Ta) {
                    Ta.Fa(Ha);
                  });
                  z.min.Fa(Ha);
                  z.max.Fa(Ha);
                }
                r = O ? 8 : 6;
                ca = new Float32Array(A.length * r);
                for (ma = 0; ma < A.length; ++ma)
                  (ca[r * ma] = A[ma].x),
                    (ca[r * ma + 1] = A[ma].y),
                    (ca[r * ma + 2] = A[ma].z),
                    (ca[r * ma + 3] = g[ma].x),
                    (ca[r * ma + 4] = g[ma].y),
                    (ca[r * ma + 5] = g[ma].z),
                    O &&
                      ((ca[r * ma + 6] = F[ma].x), (ca[r * ma + 7] = F[ma].y));
                k.sort(function (Ta, Va) {
                  return Ta.$b - Va.$b;
                });
                var bb = new (65536 > 3 * k.length ? Uint16Array : Uint32Array)(
                    3 * k.length
                  ),
                  Da = 0;
                k.forEach(function (Ta, Va) {
                  Ta.$b === Da
                    ? (E[Da].n += 3)
                    : (E.push({ n: 3, offset: 3 * Va }), ++Da);
                  bb[3 * Va] = Ta.a;
                  bb[3 * Va + 1] = Ta.b;
                  bb[3 * Va + 2] = Ta.c;
                });
                L && L.remove();
                L = Y.instance({ ka: ca, indices: bb });
                e = G = !1;
                ia && H.vh();
                Q = !0;
                H.bf();
                return Promise.resolve();
              }
              function f(r) {
                L.Na(r.n, r.offset);
              }
              function l(r, N) {
                U[N] &&
                  (C.set(U[N].mm()),
                  L.bind(!1),
                  O ? (C.Ra(), C.uj()) : (C.bb(), C.vj()),
                  U[N].Mc() && (C.Uc(), G.yc(!1), C.fe(), xb.Nb()),
                  U[N].ul(),
                  U[N].td(),
                  L.Na(r.n, r.offset));
              }
              function p(r, N) {
                U[N] &&
                  (C.set(U[N].nm()),
                  L.bind(!1),
                  O ? (C.Ra(), C.uj()) : (C.bb(), C.vj()),
                  U[N].Mc() && (C.Uc(), G.yc(!1), C.fe(), xb.Nb()),
                  H.Dc(),
                  U[N].td(),
                  L.Na(r.n, r.offset));
              }
              function w(r, N) {
                ka && U[N] && (U[N].vl(), L.Na(r.n, r.offset));
              }
              function h(r, N) {
                ka && U[N] && (U[N].xl(O), L.Na(r.n, r.offset));
              }
              function m(r, N) {
                U[N] && (C.set(U[N].im()), U[N].Hh(), L.Na(r.n, r.offset));
              }
              function q(r, N) {
                U[N] &&
                  (C.set(U[N].jm()), H.Dc(), U[N].Hh(), L.Na(r.n, r.offset));
              }
              function x(r, N) {
                U[N] &&
                  (C.set(U[N].km()),
                  U[N].Mc() && (G.yc(!1), C.fe(), xb.Nb()),
                  L.bind(!1),
                  U[N].Eh(O),
                  L.Na(r.n, r.offset));
              }
              function I(r, N) {
                if (U[N]) {
                  var ca = U[N].lm();
                  C.set(ca);
                  U[N].Mc() && (G.yc(!1), C.fe(), xb.Nb(), L.bind(!1));
                  a[ca] || (H.Dc(), L.bind(!1), (a[ca] = !0));
                  U[N].Eh(O);
                  L.Na(r.n, r.offset);
                }
              }
              function u(r, N) {
                return new Promise(function (ca, fa) {
                  r
                    ? ((r.D = function (ma) {
                        ma
                          ? (U[N] && U[N].I(),
                            (U[N] = ma),
                            (ia = ia || ma.Mc()),
                            ca())
                          : fa();
                      }),
                      Uc.instance(r))
                    : fa();
                });
              }
              if (!ha.sh()) return !1;
              var y = Object.assign(
                  {
                    ih: !1,
                    jh: !1,
                    ac: null,
                    url: "",
                    D: null,
                    ld: null,
                    Me: null,
                  },
                  b
                ),
                A = null,
                k = null,
                g = null,
                F = null,
                L = null,
                D = null,
                G = null,
                e = !1,
                n = new gc(),
                z = new Pc(),
                P = [],
                B = null,
                E = [{ n: 0, offset: 0 }],
                M = [],
                t = [],
                v = !1,
                Q = !1,
                X = [],
                U = [],
                ia = !1,
                O = !1,
                ka = !1,
                Qa = !1,
                H = {
                  visible: v,
                  hl: function () {
                    return E.length;
                  },
                  sf: function () {
                    return M;
                  },
                  vh: function () {
                    !e &&
                      O &&
                      ((k = k.filter(function (r) {
                        return null !== r;
                      })),
                      (D = Td(A, g, F, k)),
                      (G = Y.instance({ ka: D, indices: !1 })),
                      (F = g = k = A = D = null),
                      (e = !0));
                  },
                  Dc: function () {
                    xb.W();
                    H.Gh();
                  },
                  Gh: function () {
                    C.Vc("u140", n.elements);
                  },
                  Op: function () {
                    v && (H.Gh(), L.bind(!1), O ? C.Ra() : C.bb(), L.W());
                  },
                  El: function (r) {
                    v && (r || H.Dc(), L.bind(!1), O ? C.Ra() : C.bb(), L.W());
                  },
                  Fl: function () {
                    v && (L.bind(!1), O ? C.Ra() : C.bb(), E.forEach(w));
                  },
                  Dh: function () {
                    v && (L.bind(!1), O ? C.Ra() : C.bb(), t.forEach(f));
                  },
                  Cl: function (r) {
                    ka &&
                      v &&
                      (L.bind(!1),
                      O ? C.Ra() : C.bb(),
                      r ? E.forEach(m) : E.forEach(q));
                  },
                  sd: function (r) {
                    v &&
                      (r || H.Dc(),
                      L.bind(!1),
                      r || (C.Ra(), C.Uc()),
                      ka && E.forEach(h));
                  },
                  td: function (r) {
                    ka && v && (r ? E.forEach(l) : E.forEach(p));
                  },
                  zl: function () {
                    ka && v && E.forEach(I);
                  },
                  yl: function () {
                    ka && v && E.forEach(x);
                  },
                  gi: function () {
                    return B;
                  },
                  ei: function () {
                    return X;
                  },
                  Xj: function (r, N, ca) {
                    r = U[r];
                    if (!r) return !1;
                    r.update(N, ca);
                    H.Zj();
                    return !0;
                  },
                  di: function () {
                    return new Promise(function (r) {
                      H.zc(function () {
                        r(
                          U.map(function (N) {
                            return N.rm();
                          })
                        );
                      });
                    });
                  },
                  xg: function (r, N) {
                    X = r;
                    ka = !1;
                    Qa = !0;
                    U.forEach(function (ca) {
                      ca.I();
                    });
                    U = Array(r.length);
                    ia = !1;
                    r = r.map(function (ca, fa) {
                      return "string" === typeof ca
                        ? Qd(
                            -1 === ca.indexOf(".json") ? ca + ".json" : ca
                          ).then(function (ma) {
                            ma.name = ca;
                            return u(ma, fa, ca);
                          })
                        : u(ca, fa, !1);
                    });
                    Promise.all(r).then(function () {
                      H &&
                        ((ka = !0),
                        (Qa = !1),
                        H.zc(function () {
                          ia && H.vh();
                          H.Zj();
                          Ba.Gb(H);
                          Ba.oe(!0);
                          N && N(H);
                        }, 4),
                        H.bf());
                    });
                  },
                  Zj: function () {
                    t.splice(0);
                    E.forEach(function (r, N) {
                      U[N] && U[N].Um() && t.push(r);
                    });
                  },
                  zc: function (r, N) {
                    Q && ka && !Qa ? r(H) : P.push({ sb: r, order: N ? N : 0 });
                  },
                  bf: function () {
                    Q &&
                      ka &&
                      !Qa &&
                      (P.sort(function (r, N) {
                        return 0 > r.order - N.order ? 1 : -1;
                      }),
                      P.forEach(function (r) {
                        r.sb(H);
                      }),
                      P.splice(0));
                  },
                  remove: function () {
                    H.I();
                    H = null;
                  },
                  I: function () {
                    v = Q = !1;
                    L && L.remove();
                    U.forEach(function (r) {
                      r.I();
                    });
                    e && G.remove();
                    E.splice(0);
                  },
                  pm: function () {
                    return z.size().x;
                  },
                  qm: function () {
                    return z.size().y;
                  },
                  fq: function () {
                    return z.size().z;
                  },
                  Tl: function () {
                    return Fc(z).x;
                  },
                  Ul: function () {
                    return Fc(z).y;
                  },
                  Up: function () {
                    return Fc(z).z;
                  },
                  aq: function () {
                    return z.min.y;
                  },
                  replace: function (r, N, ca) {
                    if (r === B) return N && H && (H.bf(), N(H)), !1;
                    B = r;
                    Ba.oe(!1);
                    Rc(
                      r,
                      function (fa) {
                        d(fa)
                          .then(function () {
                            N && N(H);
                          })
                          .catch(function (ma) {
                            ca && ca(ma);
                          });
                      },
                      ca
                    );
                    return !0;
                  },
                };
              y.ac && H.xg(y.ac, y.Me);
              B = y.url;
              Rc(y.url, function (r) {
                d(r).then(function () {
                  y.D && y.D(H);
                });
              });
              return H;
            },
            Pn: function () {
              a.s106 = !1;
              a.s106color = !1;
              a.s106NormalMap = !1;
              a.s106ParamsMap = !1;
              a.s106NormalParamsMap = !1;
            },
          };
        })(),
        Gc = (function () {
          var a = null,
            b = !1,
            d = !1,
            f = null,
            l = new Float32Array(16),
            p = new Float32Array(3),
            w = { data: 0 },
            h = {
              m: function () {
                a = W.Ob
                  ? new Worker("js/worker.php")
                  : {
                      postMessage: function (m) {
                        w.data = m;
                        Vc.rn(w);
                      },
                      terminate: function () {},
                    };
                a.onmessage = function (m) {
                  switch (m.data[0]) {
                    case 3:
                      for (var q = 0; 16 > q; ++q) l[q] = m.data[q + 1];
                      for (q = 0; 3 > q; ++q) p[q] = m.data[q + 17];
                      xb.lf().ro(l, p);
                      break;
                    case 6:
                      h.lo(),
                        (b = !0),
                        Yb.ib(!1),
                        W.ga_ && (Jb.enable(), Jb.ge());
                  }
                };
                f = new Float32Array(6);
                f[0] = 2;
                W.Ob || Vc.no(a);
              },
              Lo: function () {
                W.Ah || (d = !0);
              },
              Xq: function () {
                d = !1;
              },
              Zn: function (m, q) {
                if (q || (b && d))
                  (f[1] = m[0]),
                    (f[2] = m[1]),
                    (f[3] = m[2]),
                    (f[4] = m[3]),
                    (f[5] = m[4]),
                    a.postMessage(f);
              },
              lo: function () {
                a.postMessage([5, W.qh]);
              },
              I: function () {
                W.Ob && a.terminate();
              },
            };
          return h;
        })(),
        Vc = (function () {
          var a = 0,
            b = 0,
            d = 0,
            f = [0, 0],
            l = new gc(),
            p = new Ec(),
            w = new Ec(),
            h = new Za(),
            m = new Za(),
            q = new fc(),
            x = 0,
            I = new Float32Array(20);
          I[0] = 3;
          var u = null,
            y = { data: !1 },
            A = {
              m: function () {
                "undefined" === typeof W && (self.tp = { Ob: !0 });
                W.Ob && A.kg([6]);
              },
              rn: function (k) {
                switch (k.data[0]) {
                  case 2:
                    A.yg(k.data);
                    break;
                  case 5:
                    x = k.data[1];
                }
              },
              kg: function (k) {
                W.Ob ? postMessage(k) : ((y.data = k), u.onmessage(y));
              },
              yg: function (k) {
                a = k[1];
                b = k[2];
                d = k[3];
                f[0] = k[4];
                f[1] = k[5];
                h.set(f[0], f[1], -d);
                q.set(b, a, 0, "XYZ");
                if (!1 === q instanceof fc)
                  throw Error(
                    "JETHREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order."
                  );
                k = Math.cos(q.F / 2);
                var g = Math.cos(q.G / 2),
                  F = Math.cos(q.H / 2),
                  L = Math.sin(q.F / 2),
                  D = Math.sin(q.G / 2),
                  G = Math.sin(q.H / 2),
                  e = q.order;
                "XYZ" === e
                  ? ((p.F = L * g * F + k * D * G),
                    (p.G = k * D * F - L * g * G),
                    (p.H = k * g * G + L * D * F),
                    (p.T = k * g * F - L * D * G))
                  : "YXZ" === e
                  ? ((p.F = L * g * F + k * D * G),
                    (p.G = k * D * F - L * g * G),
                    (p.H = k * g * G - L * D * F),
                    (p.T = k * g * F + L * D * G))
                  : "ZXY" === e
                  ? ((p.F = L * g * F - k * D * G),
                    (p.G = k * D * F + L * g * G),
                    (p.H = k * g * G + L * D * F),
                    (p.T = k * g * F - L * D * G))
                  : "ZYX" === e
                  ? ((p.F = L * g * F - k * D * G),
                    (p.G = k * D * F + L * g * G),
                    (p.H = k * g * G - L * D * F),
                    (p.T = k * g * F + L * D * G))
                  : "YZX" === e
                  ? ((p.F = L * g * F + k * D * G),
                    (p.G = k * D * F + L * g * G),
                    (p.H = k * g * G - L * D * F),
                    (p.T = k * g * F - L * D * G))
                  : "XZY" === e &&
                    ((p.F = L * g * F - k * D * G),
                    (p.G = k * D * F - L * g * G),
                    (p.H = k * g * G + L * D * F),
                    (p.T = k * g * F + L * D * G));
                h.y -= x;
                k = l.elements;
                G = p.x;
                var n = p.y,
                  z = p.z;
                L = p.w;
                var P = G + G,
                  B = n + n;
                D = z + z;
                g = G * P;
                F = G * B;
                G *= D;
                e = n * B;
                n *= D;
                z *= D;
                P *= L;
                B *= L;
                L *= D;
                k[0] = 1 - (e + z);
                k[4] = F - L;
                k[8] = G + B;
                k[1] = F + L;
                k[5] = 1 - (g + z);
                k[9] = n - P;
                k[2] = G - B;
                k[6] = n + P;
                k[10] = 1 - (g + e);
                k[3] = 0;
                k[7] = 0;
                k[11] = 0;
                k[12] = 0;
                k[13] = 0;
                k[14] = 0;
                k[15] = 1;
                l.setPosition(h);
                w.N(p).inverse();
                k = m.N(h);
                n = k.x;
                P = k.y;
                z = k.z;
                g = w.x;
                F = w.y;
                L = w.z;
                D = w.w;
                G = D * n + F * z - L * P;
                e = D * P + L * n - g * z;
                B = D * z + g * P - F * n;
                n = -g * n - F * P - L * z;
                k.x = G * D + n * -g + e * -L - B * -F;
                k.y = e * D + n * -F + B * -g - G * -L;
                k.z = B * D + n * -L + G * -F - e * -g;
                for (k = 1; 17 > k; ++k) I[k] = l.elements[k - 1];
                I[17] = m.x;
                I[18] = m.y;
                I[19] = m.z;
                A.kg(I);
              },
              no: function (k) {
                u = k;
                A.kg([6]);
              },
            };
          return A;
        })();
      Vc.m();
      var Uc = (function () {
          function a(w) {
            var h = w.split(":").shift();
            return "data" === h || "blob" === h
              ? w
              : ("undefined" !== typeof J && J.ea ? J : W).ea + W.Mi + w;
          }
          function b(w, h) {
            return Math.min(h + w + h * w, 1);
          }
          var d = !1,
            f = null,
            l = 1,
            p = {
              diffuseTexture: null,
              normalTexture: null,
              paramsTexture: null,
              isDisableColorTexture: !1,
              colorTextureUsage: 0,
              metalness: 0.5,
              roughness: 0.5,
              fresnelMin: 0,
              fresnelMax: 1,
              fresnelPow: 5,
              alpha: 1,
              diffuseColor: [255, 255, 255],
              paramsMapMask: [0, 0, 0, 0],
              alphaUsage: 0,
              D: null,
            };
          return {
            m: function () {
              f = ba.instance({
                width: 1,
                height: 1,
                isMipmap: !1,
                L: 4,
                array: new Uint8Array([255, 255, 255, 255]),
                Gf: !1,
              });
            },
            ef: function () {
              d = !0;
              l = 2;
            },
            instance: function (w) {
              function h() {
                "number" === typeof g.alpha
                  ? ((A[0] = g.alpha), (A[1] = 0), (A[2] = 0), (A[3] = 0))
                  : ((A[0] = g.alpha[0]),
                    (A[1] = g.alpha[1] - g.alpha[0]),
                    (A[2] = g.alpha[2]),
                    (A[3] = g.alpha[3]));
                var v = 1 <= g.fresnelPow ? g.fresnelMin : g.fresnelMax;
                k[0] = b(A[0], v);
                k[1] = b(A[1], v);
                k[2] = A[2];
                k[3] = A[3];
                e = {
                  Vi: g.fresnelMax,
                  Ii: [
                    g.fresnelMin,
                    g.roughness,
                    g.fresnelPow / 15,
                    g.metalness,
                  ],
                  Li: g.paramsMapMask,
                };
                F = [
                  g.diffuseColor[0] / 255,
                  g.diffuseColor[1] / 255,
                  g.diffuseColor[2] / 255,
                ];
              }
              function m() {
                return new Promise(function (v) {
                  (u = g.normalTexture && ha.al() ? !0 : !1) && !D.Ga
                    ? (D.Ga = ba.instance({
                        url: a(g.normalTexture),
                        isLinear: !0,
                        isMipmap: !0,
                        isAnisotropicFiltering: !1,
                        isPot: !0,
                        L: 3,
                        D: v,
                      }))
                    : v();
                });
              }
              function q() {
                return new Promise(function (v) {
                  (y = g.diffuseTexture && "" !== g.diffuseTexture ? !0 : !1) &&
                  !D.ha
                    ? ((D.ha = ba.instance({
                        url: a(g.diffuseTexture),
                        isMipmap: !0,
                        isLinear: !0,
                        isPot: !0,
                        isAnisotropicFiltering: !0,
                        isSrgb: !1,
                        isMirrorY: !1,
                        isMirrorX: !1,
                        L: 4,
                        D: v,
                      })),
                      (L = "s111"))
                    : (D.ha || ((L = "s112"), (D.ha = f)), v());
                });
              }
              function x() {
                return new Promise(function (v) {
                  (G = g.paramsTexture ? !0 : !1) && !D.$a
                    ? g.paramsTexture === g.diffuseTexture
                      ? ((D.$a = D.ha), v())
                      : (D.$a = ba.instance({
                          url: a(g.paramsTexture),
                          isMipmap: !0,
                          isLinear: !0,
                          isPot: !0,
                          isAnisotropicFiltering: !1,
                          isSrgb: !1,
                          isMirrorY: !1,
                          isMirrorX: !1,
                          L: 4,
                          D: v,
                        }))
                    : v();
                });
              }
              function I(v, Q) {
                h();
                Promise.all([m(), q(), x()]).then(function () {
                  u || G || y
                    ? u || G
                      ? u && !G
                        ? ((n = "s106NormalMap"),
                          (z = "s106NNGLtextureNormalMap"))
                        : !u && G
                        ? ((n = "s106ParamsMap"),
                          (z = "s106NNGLtextureParamsMap"))
                        : ((n = "s106NormalParamsMap"),
                          (z = "s106NNGLtextureNormalParamsMap"))
                      : ((n = "s106"), (z = "s106NNGLtexture"))
                    : ((n = "s106color"), (z = "s106NNGLcolor"));
                  P = u ? "s114" : "s113";
                  B = u ? "s108" : "s118";
                  E = G ? "s116" : "s115";
                  M = G ? "s109" : "s119";
                  Q && g.D && setTimeout(g.D.bind(null, v), 1);
                });
              }
              var u,
                y,
                A = [1, 0, 0, 0],
                k = [0, 0, 0, 0],
                g = Object.assign({}, p, w),
                F = null,
                L = null,
                D = { ha: null, Ga: null, $a: null },
                G = (u = y = !1),
                e = null,
                n = null,
                z = null,
                P = null,
                B = null,
                E = null,
                M = null,
                t = {
                  update: function (v, Q) {
                    void 0 === Q && (Q = !0);
                    Object.assign(g, v);
                    Q ? (t.I(), I(t, !1)) : h();
                  },
                  Mc: function () {
                    return u;
                  },
                  Um: function () {
                    return 0.99 > A[0];
                  },
                  rm: function () {
                    return g;
                  },
                  nm: function () {
                    return B;
                  },
                  mm: function () {
                    return P;
                  },
                  jm: function () {
                    return M;
                  },
                  im: function () {
                    return E;
                  },
                  lm: function () {
                    return n;
                  },
                  km: function () {
                    return z;
                  },
                  td: function () {
                    u && D.Ga.h(0);
                  },
                  xl: function (v) {
                    d && C.set(L);
                    v ? C.Ra() : C.bb();
                    y && C.Uc();
                    t.sd();
                  },
                  sd: function () {
                    y &&
                      (C.C("u74", g.alphaUsage),
                      C.C("u73", g.colorTextureUsage),
                      (g.isDisableColorTexture ? f : D.ha).h(0));
                    C.Dg("u150", F);
                  },
                  Hh: function () {
                    G && (D.$a.h(0), C.Ba("u76", e.Li), C.Uc());
                    C.Ba("u114", e.Ii);
                    C.C("u151", e.Vi);
                  },
                  Eh: function (v) {
                    G && !u
                      ? D.$a.h(l)
                      : u && (y || f.h(0), D.Ga.h(l), G && D.$a.h(l + 1));
                    G && C.Ba("u76", e.Li);
                    y || u ? C.ho() : v ? C.io() : C.jo();
                    t.sd();
                    C.Ba("u13", A);
                    C.Ba("u114", e.Ii);
                    C.C("u151", e.Vi);
                  },
                  ul: function () {
                    C.Ba("u13", A);
                  },
                  vl: function () {
                    C.Ba("u13", k);
                  },
                  I: function () {
                    y && D.ha.remove();
                    u && D.Ga.remove();
                    G && g.paramsTexture !== g.diffuseTexture && D.$a.remove();
                    Object.assign(D, { ha: null, Ga: null, $a: null });
                  },
                };
              I(t, !0);
              return t;
            },
          };
        })(),
        Jb = (function () {
          var a = 0,
            b = 0,
            d = 0,
            f = 0,
            l = 0,
            p = 0,
            w = W.Ik,
            h = W.Hk,
            m = W.Jk,
            q = 0,
            x = 0,
            I = null,
            u = null,
            y = 0,
            A = 0,
            k = 0,
            g = 0,
            F = 0,
            L = null,
            D = 0,
            G = 0,
            e = 0,
            n = Date.now(),
            z = null,
            P = !1,
            B = !1,
            E = !1,
            M = 1,
            t = !1,
            v = {
              m: function () {
                a = W.Dk[ha.X()];
                b = W.Ck[ha.X()];
                d = W.Bk[ha.X()];
                G = W.Ek[ha.X()];
                f = W.vk[ha.X()];
                l = W.zk[ha.X()];
                k = W.Ak[ha.X()];
                g = ha.P();
                F = ha.$();
                q = Math.round(g * a);
                x = Math.round(F * a);
                u = Ea.instance({ width: q, height: x, Hc: !1 });
                I = ba.instance({
                  width: q,
                  height: x,
                  isPot: !1,
                  isLinear: !0,
                });
                L = ba.instance({
                  width: q,
                  height: x,
                  isPot: !1,
                  isLinear: !0,
                  L: 1,
                });
                P = !0;
              },
              resize: function (Q, X, U) {
                M = U;
                g = Q;
                F = X;
                q = Math.round(Q * a);
                x = Math.round(X * a);
                u.resize(q, x);
                B = !0;
              },
              W: function () {
                var Q = Math.exp(-(Date.now() - n) / G);
                D = E ? e + (1 - Q) * (1 - e) : e * Q;
                y = b + D * (d - b);
                A = f + (1 - D) * (1 - f);
                p = l + (1 - D) * (1 - l);
                ba.aa(5);
                if (B && P)
                  ba.aa(6),
                    L.resize(q, x),
                    C.set("s0"),
                    C.ie("u1", 6),
                    u.bind(!1, !0),
                    L.u(),
                    u.Qe(),
                    I.h(6),
                    Y.l(!0, !0),
                    I.resize(q, x),
                    I.u(),
                    L.h(6),
                    Y.l(!1, !1),
                    C.ie("u1", 0),
                    (B = !1);
                else {
                  c.enable(c.BLEND);
                  c.blendFunc(c.CONSTANT_ALPHA, c.ONE_MINUS_SRC_ALPHA);
                  Q = y / k;
                  c.blendColor(Q, Q, Q, Q);
                  c.colorMask(!0, !1, !1, !0);
                  C.set("s98");
                  xb.cf();
                  C.C("u131", y);
                  G && (C.C("u132", A), C.C("u123", p));
                  var X = M * (w + Math.pow(Math.random(), m) * (h - w));
                  C.O("u14", X / g, X / F);
                  u.mh();
                  u.Wc();
                  I.u();
                  X = 2 * Math.PI * Math.random();
                  for (var U = !0, ia = 0; ia < k; ++ia)
                    1 === ia &&
                      (c.blendFunc(c.SRC_ALPHA, c.ONE), C.C("u131", Q)),
                      C.C("u130", X + (ia / k) * (Math.PI / 2)),
                      C.O(
                        "u129",
                        (Math.random() - 0.5) / g,
                        (Math.random() - 0.5) / F
                      ),
                      Y.l(U, U),
                      (U = !1);
                  c.disable(c.BLEND);
                  C.set("s99");
                  C.O("u14", 1 / q, 1 / x);
                  L.u();
                  I.h(7);
                  Y.l(!1, !1);
                  c.colorMask(!0, !0, !0, !0);
                }
              },
              h: function (Q) {
                L.h(Q);
              },
              enable: function () {
                t = !0;
              },
              An: function () {
                if (E || !t) return !1;
                z && clearTimeout(z);
                v.ge();
                z = setTimeout(v.Wj, 400);
              },
              ge: function () {
                z && (clearTimeout(z), (z = !1));
                !E &&
                  t &&
                  (window.ik.disable(), (E = !0), (n = Date.now()), (e = D));
              },
              Wj: function () {
                E &&
                  t &&
                  (z && (clearTimeout(z), (z = null)),
                  window.ik.enable(),
                  (E = !1),
                  (n = Date.now()),
                  (e = D));
              },
              I: function () {
                I.remove();
                L.remove();
                u.remove();
              },
            };
          v.An();
          return v;
        })(),
        ce = {
          instance: function (a) {
            var b = a.V.P(),
              d = a.Nm ? !0 : !1,
              f = d ? "s85" : "s75",
              l = a.V,
              p = a.V.Sm() && Ia.ja(),
              w = ba.instance({
                isFloat: p && !d,
                isLinear: !0,
                isMipmap: !1,
                isPot: !0,
                width: b,
                height: b,
                L: d ? 4 : 3,
              }),
              h = ba.instance({
                isFloat: p,
                isLinear: !0,
                isPot: !0,
                width: 1,
                height: b / 2,
                L: 3,
              });
            d = Math.round(Math.log(b) / Math.log(2));
            for (var m = [], q = 0, x = 0; x <= d; ++x) {
              var I = Math.pow(2, d - x),
                u = I / 2;
              if (4 > u) break;
              m.push({
                bp: b / I,
                da: I,
                Tb: u,
                qp: q,
                V:
                  0 === x
                    ? a.V
                    : ba.instance({
                        isFloat: p,
                        isPot: !0,
                        isLinear: !0,
                        width: I,
                        height: u,
                      }),
              });
              q += u;
              if (0 !== q % 1) break;
            }
            w.ko = function (y) {
              l = y;
              m[0].V = y;
            };
            w.Ln = function () {
              h.J();
              C.set("s92");
              l.h(0);
              Y.l(!0, !0);
              C.set("s12");
              h.h(1);
              var y = l;
              m.forEach(function (A, k) {
                0 !== k &&
                  (A.V.J(),
                  y.h(0),
                  ba.po(),
                  C.O("u93", 1, 1),
                  C.C("u94", Math.min(6 / A.Tb, 0.5)),
                  Y.l(!1, !1),
                  (y = A.V));
              });
              C.set(f);
              C.C("u91", W.Rc);
              w.u();
              m.forEach(function (A) {
                c.viewport(0, A.qp, b, A.Tb);
                C.O("u90", A.bp, 1);
                A.V.h(0);
                ba.so();
                Y.l(!1, !1);
              });
            };
            w.On = w.remove;
            w.remove = function () {
              w.On();
              h.remove();
              m.forEach(function (y) {
                y.V.remove();
              });
              m.splice(0);
            };
            return w;
          },
        };
      za.La = (function () {
        var a = {
            Tc: 45,
            sg: 1,
            Db: "../../images/debug/picsou.png",
            ee: 0.8,
            Of: 3.14 / 6,
            Pf: 0.314,
            Pd: 4,
            Od: 0.5,
            Nf: -0.25,
            Ym: 1,
            da: 256,
            Mf: 0.15,
          },
          b = { qb: null, Pb: null, screen: null },
          d = !1,
          f = !1,
          l = -1,
          p = null,
          w = null,
          h = null,
          m = Math.PI / 180,
          q = [1, 1],
          x = !1,
          I = {
            m: function (u) {
              l = u.width;
              u = {
                isFloat: Ia.ja(),
                U: !0,
                isPot: !1,
                isMipmap: !1,
                width: l,
                height: l / 2,
                L: 3,
              };
              b.qb && (b.qb.remove(), b.Pb.remove());
              b.Pb = ba.instance(Object.assign({ isLinear: !1 }, u));
              b.qb = Mc.instance(Object.assign({ isLinear: !0 }, u));
              C.j("s120", [{ type: "1i", name: "u158", value: 0 }]);
              C.j("s121", [
                { type: "1i", name: "u95", value: 0 },
                { type: "1i", name: "u103", value: 1 },
                { type: "1i", name: "u163", value: 2 },
              ]);
              I.$j();
              x = !0;
            },
            $j: function () {
              C.j("s121", [
                { type: "1f", name: "u164", value: a.Of },
                { type: "1f", name: "u165", value: a.Pf },
                { type: "1f", name: "u166", value: a.Pd },
                { type: "1f", name: "u167", value: a.Od },
                { type: "1f", name: "u168", value: a.Nf },
              ]);
            },
            tq: function () {
              return f;
            },
            ra: function (u) {
              p = u;
            },
            Sc: function () {
              w =
                "uniform sampler2D u158;uniform vec2 u159,u160,u10;uniform int u161;uniform float u162,u144;varying vec2 vv0;const float h=3.141593;const vec2 i=vec2(.5);const float e=1.2;const vec3 g=vec3(1.);void main(){vec2 c=vec2(vv0.x*2.,-vv0.y+.5)*h,a=i+u10*(c-u159)/u160;float b=1.;if(u161==0){if(a.x<0.||a.x>1.||a.y<0.||a.y>1.)discard;}else b*=smoothstep(-e,0.,a.x),b*=1.-smoothstep(1.,1.+e,a.x),b*=smoothstep(-e,0.,a.y),b*=1.-smoothstep(1.,1.+e,a.y);vec3 d=mix(u162*g,texture2D(u158,a).rgb*u144,b*g);gl_FragColor=vec4(d,1.);}";
              h =
                "uniform sampler2D u95,u103,u163;uniform float u164,u165,u166,u167,u168,u169;varying vec2 vv0;const float f=3.141593;const vec2 h=vec2(.5);const vec3 i=vec3(1.);void main(){float j=(vv0.x*2.-1.)*f,c=(-vv0.y+.5)*f;vec4 a=texture2D(u163,h);float d=a.r,k=u166*a.g,l=u167*(a.b+u168),b=a.a,g=asin(cos(b)*cos(d)),m=atan(cos(b)*sin(d),-sin(b)),n=acos(sin(c)*sin(g)+cos(c)*cos(g)*cos(j-m)),o=1.-smoothstep(u164-u165,u164+u165,n);vec3 p=i*(max(l,0.)+max(k,0.)*o),q=texture2D(u95,vv0).rgb,r=texture2D(u103,vv0).rgb;gl_FragColor=vec4(mix(p+r,q,u169),1.);}";
              C.oa("s120", {
                name: "_",
                g: w,
                i: "u158 u159 u161 u160 u162 u144 u10".split(" "),
                precision: "highp",
              });
              C.oa("s121", {
                name: "_",
                g: h,
                i: "u163 u164 u165 u166 u167 u168 u103 u95 u169".split(" "),
                precision: "highp",
              });
            },
            Ig: function (u, y, A, k, g, F, L, D) {
              C.O("u159", y, A);
              C.ie("u161", k ? 1 : 0);
              C.O("u160", g, g / F);
              C.Bg("u10", L);
              u.h(0);
              Y.l(D, D);
            },
            hi: function () {
              return b.qb.bi();
            },
            oh: function (u) {
              I.m({ width: a.da });
              I.ak(u, !1, 1);
              f = !0;
            },
            nh: function () {
              (d && b.screen.tm() === a.Db) ||
                ((d = !1),
                b.screen && b.screen.remove(),
                (b.screen = ba.instance({
                  url: a.Db,
                  isFloat: !1,
                  D: function () {
                    d = !0;
                  },
                })));
            },
            yg: function (u) {
              Object.assign(a, u);
            },
            ib: function (u) {
              I.yg(u);
              x && (I.$j(), I.nh());
            },
            ak: function (u, y, A) {
              Ea.ba();
              b.Pb.J();
              C.set("s120");
              C.C("u162", a.Mf);
              C.C("u144", a.Ym);
              I.Ig(u, Math.PI, 0, !0, 90 * m, u.P() / u.$(), q, !0);
              d &&
                ((u = a.da),
                C.C("u144", a.ee),
                c.viewport(0, 0, u / 2, u / 2),
                I.Ig(b.screen, 0, 0, !1, 2 * a.Tc * m, 2 * a.sg, q, !1),
                c.viewport(u / 2, 0, u / 2, u / 2),
                I.Ig(
                  b.screen,
                  2 * Math.PI,
                  0,
                  !1,
                  2 * a.Tc * m,
                  2 * a.sg,
                  q,
                  !1
                ));
              y
                ? (C.set("s121"),
                  C.C("u169", 1 - A),
                  b.qb.tj(0),
                  b.Pb.h(1),
                  y.h(2),
                  Y.l(!1, !1),
                  p.wg(b.qb.bi()))
                : p.wg(b.Pb);
            },
            A: function () {
              x = !1;
              Object.assign(b, { qb: null, Pb: null, screen: null });
              f = d = !1;
              l = -1;
              p = null;
            },
          };
        return I;
      })();
      za.mb = (function () {
        var a = !1,
          b = !0,
          d = null,
          f = null,
          l = 1,
          p = null,
          w = {
            Sc: function () {
              ha.ca() &&
                (C.oa("s122", {
                  name: "_",
                  v: "attribute vec3 a0;uniform sampler2D u41;uniform float u147;uniform vec2 u42;uniform vec3 u146;const float l=0.,m=0.,D=1.;const vec2 e=vec2(1.);const vec3 n=vec3(1.);const vec2 E=vec2(-1.,1.),o=vec2(.16,.5),p=vec2(.5,.5),q=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 r(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,o);vec2 f=u87*e;vec3 c=u87*n;vec2 s=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,p).rgb+vec3(u81,0.,0.),u84,c);float t=mix(texture2D(u41,q).r,0.,u87);a.z+=t;mat3 u=r(a);vec3 v=mix(u146,u85,c);float w=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 x=mat2(h,i,-i,h);b.xy=x*b.xy;float y=mix(u83,1.,u87);vec2 j=u82/s;vec3 k=a0;float z=max(0.,-a0.z-l)*m;k.x+=z*sign(a0.x)*(1.-u87);vec3 A=u*(k+v)*w+b;vec2 B=j*y;vec3 C=vec3(g*B,-j)+A*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(C,1.));}",
                  g: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,1.,1.),gl_FragData[2]=vec4(1.,0.,0.,0.),gl_FragData[3]=vec4(0.,.5,1.,0.);}",
                  i: ["u41", "u42", "u80", "u146", "u147"].concat(
                    C.Cd(),
                    C.Dd()
                  ),
                  K: ["a0"],
                  S: [3],
                  fa: !0,
                }),
                (a = !0));
            },
            m: function (h) {
              a &&
                C.j(
                  "s122",
                  [
                    { type: "1i", name: "u41", value: 1 },
                    { type: "3f", name: "u80", value: h.Ha },
                    { type: "1f", name: "u147", value: 1 },
                    { type: "1f", name: "u81", value: 0 },
                    { type: "1f", name: "u89", value: 1 },
                  ].concat(h.Tg)
                );
            },
            fb: function (h, m) {
              f = h;
              l = m;
              w.ni();
            },
            eb: function (h, m) {
              d = h;
              p = m;
              w.ni();
            },
            ni: function () {
              if (ha.ca() && f && d) {
                var h = [d[0] * f, d[1] * f, d[2] * f],
                  m = p;
                h[0] += m[0];
                h[1] += m[1];
                h[2] += m[2];
                C.j("s122", [
                  { type: "1f", name: "u147", value: l },
                  { type: "3f", name: "u146", value: h },
                ]);
                C.M();
              }
            },
            Dm: function (h) {
              for (
                var m = h.width / 2,
                  q = h.height / 2,
                  x = h.depth,
                  I = h.Gl,
                  u = h.height / 4,
                  y = h.kl,
                  A = 2 * y + 4,
                  k = [],
                  g = [],
                  F = -m + h.Va,
                  L = -I - h.Va,
                  D = m - h.Va,
                  G = -I - h.Va,
                  e = 0;
                e < A;
                ++e
              ) {
                var n = 0,
                  z = 0;
                0 === e
                  ? ((n = -m), (z = -I - x))
                  : 1 <= e && e <= 1 + y
                  ? ((z = (((e - 1) / y) * Math.PI) / 2),
                    (n = F - Math.cos(z) * h.Va),
                    (z = L + Math.sin(z) * h.Va))
                  : e >= 2 + y && e <= 2 + 2 * y
                  ? ((z = (((e - 2 - y) / y) * Math.PI) / 2),
                    (n = D + Math.sin(z) * h.Va),
                    (z = G + Math.cos(z) * h.Va))
                  : e === A - 1 && ((n = m), (z = -I - x));
                k.push(n, q + u, z, n, -q + u, z);
                0 !== e &&
                  g.push(
                    2 * e,
                    2 * e - 2,
                    2 * e - 1,
                    2 * e,
                    2 * e - 1,
                    2 * e + 1
                  );
              }
              return w.instance({ ka: k, indices: g });
            },
            toggle: function (h) {
              b = h;
            },
            instance: function (h) {
              var m = Y.instance({ ka: h.ka, indices: h.indices });
              return {
                W: function () {
                  a && b && (C.set("s122"), m.bind(!0), m.W());
                },
              };
            },
          };
        return w;
      })();
      za.ia = (function () {
        function a(t) {
          C.j("s125", t);
          C.j("s126", t);
        }
        var b = {
          wf: -87,
          wm: [85, 95],
          mi: [90, 90],
          li: [85, 70],
          md: 24,
          Ip: 12,
          ll: 2,
          lg: [-80, 40],
          Ri: [0, -10],
          on: 40,
          qn: 20,
          Si: [70, 50],
          pn: 90,
          To: 2,
          ke: [0, -15],
          Ce: 1024,
          lb: 512,
          Xd: 4,
          Jo: [6, 30],
          Qi: 1.2,
        };
        b.aj = b.lg;
        var d = !1,
          f = !1,
          l = !1,
          p = null,
          w = null,
          h = null,
          m = null,
          q = null,
          x = null,
          I = !1,
          u = !1,
          y = null,
          A = null,
          k = null,
          g = null,
          F = 0.5,
          L = [{ type: "1f", name: "u171", value: 1 }],
          D = null,
          G = null,
          e = 0,
          n = ["u41", "u42", "u147", "u146"],
          z = null,
          P = null,
          B = null,
          E = null,
          M = {
            Sc: function () {
              C.oa("s123", {
                name: "_",
                v: "attribute vec3 a0;uniform vec3 u146;uniform vec2 u172,u173;uniform float u147,u174,u175,u176;varying float vv0,vv1;void main(){vec3 a=(a0+u146)*u147;float b=atan(a.x,a.z-u174),d=2.*(a.y-u175)/(u176-u175)-1.;vv0=a0.y;float g=1.-u172.x*u172.x/(u172.y*u172.y),c=u172.x/sqrt(1.-g*pow(cos(b),2.));vec3 h=vec3(c*sin(b),a.y,c*cos(b)+u174);vv1=smoothstep(u173.x,u173.y,length(h-a)),gl_Position=vec4(b,d,0.,1.);}",
                g: "uniform float u177;uniform vec4 u13;varying float vv0,vv1;void main(){float a=u13.x+u13.y*smoothstep(-u13.w,-u13.z,vv0),b=min(a,1.)*u177;gl_FragColor=vec4(b,vv1,1.,1.);}",
                i: "u147 u146 u172 u173 u174 u175 u176 u13 u177".split(" "),
                K: ["a0"],
                S: [3],
                precision: "highp",
              });
              C.oa("s124", {
                name: "_",
                g: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u1,vv0-3.*u14),c=texture2D(u1,vv0-2.*u14),d=texture2D(u1,vv0-u14),f=texture2D(u1,vv0+u14),g=texture2D(u1,vv0+2.*u14),h=texture2D(u1,vv0+3.*u14);float j=.031496*b.r+.110236*c.r+.220472*d.r+.275591*a.r+.220472*f.r+.110236*g.r+.031496*h.r;vec2 i=b.gb*b.b+c.gb*c.b+d.gb*d.b+a.gb*a.b+f.gb*f.b+g.gb*g.b+h.gb*h.b;i/=b.b+c.b+d.b+a.b+f.b+g.b+h.b,gl_FragColor=vec4(mix(j,a.r,1.-i.x),i,1);}",
                i: ["u1", "u14"],
                precision: "lowp",
              });
              C.oa("s125", {
                name: "_",
                v: "attribute vec3 a0,a2;attribute vec2 a1;varying vec2 vv0;varying float vv1;uniform sampler2D u41;uniform vec2 u42;uniform float u147;uniform vec3 u146;const float o=0.,p=0.;const vec2 e=vec2(1.);const vec3 q=vec3(1.);const vec2 G=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,r);vec2 g=u87*e;vec3 c=u87*q;vec2 v=mix(d.a*u42,e,g),h=(2.*d.gb-e)*(1.-g);h.x*=-1.;vec3 a=mix(texture2D(u41,s).rgb+vec3(u81,0.,0.),u84,c);float w=mix(texture2D(u41,t).r,0.,u87);a.z+=w;mat3 i=u(a);vec3 x=mix(u146,u85,c);float y=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float j=cos(a.z),k=sin(a.z);mat2 z=mat2(j,k,-k,j);b.xy=z*b.xy;float A=mix(u83,1.,u87);vec2 l=u82/v;vec3 m=a0;float B=max(0.,-a0.z-o)*p;m.x+=B*sign(a0.x)*(1.-u87);vec3 C=i*(m+x)*y+b;vec2 D=l*A;vec3 E=vec3(h*D,-l)+C*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(E,1.)),vv0=a1,gl_Position*=vec4(-1.,1.,1.,1.);vec3 F=i*a2;vv1=-F.z,vv1*=vv1*1e-5+smoothstep(5.,50.,abs(a0.x));}",
                g: "uniform sampler2D u178,u163;uniform vec2 u93,u179;uniform float u180,u171;varying vec2 vv0;varying float vv1;void main(){vec2 b=u179*u180+u93*vv0;vec4 a=u171*texture2D(u178,b);a.r*=step(0.,vv0.y),gl_FragColor=vec4(0.,0.,0.,a.r*vv1);}",
                i: "u178 u163 u80 u180 u179 u93 u171"
                  .split(" ")
                  .concat(C.Cd(), C.Dd(), n),
                K: ["a0", "a2", "a1"],
                S: [3, 3, 2],
                precision: "lowp",
              });
              C.oa("s126", {
                name: "_",
                v: "attribute vec3 a0;uniform sampler2D u41;uniform vec2 u42;uniform float u147;uniform vec3 u146;const float l=0.,m=0.;const vec2 e=vec2(1.);const vec3 n=vec3(1.);const vec2 D=vec2(-1.,1.),o=vec2(.16,.5),p=vec2(.5,.5),q=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 r(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,o);vec2 f=u87*e;vec3 c=u87*n;vec2 s=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,p).rgb+vec3(u81,0.,0.),u84,c);float t=mix(texture2D(u41,q).r,0.,u87);a.z+=t;mat3 u=r(a);vec3 v=mix(u146,u85,c);float w=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 x=mat2(h,i,-i,h);b.xy=x*b.xy;float y=mix(u83,1.,u87);vec2 j=u82/s;vec3 k=a0;float z=max(0.,-a0.z-l)*m;k.x+=z*sign(a0.x)*(1.-u87);vec3 A=u*(k+v)*w+b;vec2 B=j*y;vec3 C=vec3(g*B,-j)+A*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(C,1.)),gl_Position*=vec4(-1.,1.,1.,1.);}",
                g: "void main(){gl_FragColor=vec4(0.);}",
                i: ["u80"].concat(C.Cd(), C.Dd(), n),
                K: ["a0"],
                S: [3],
                precision: "lowp",
              });
              d = !0;
            },
            m: function (t) {
              if (d) {
                if (void 0 === t.jc || !t.jc) return !1;
                if (f) M.rj(t);
                else {
                  m = ba.instance({
                    isFloat: !1,
                    isPot: !1,
                    isMipmap: !1,
                    isLinear: !0,
                    width: b.Ce,
                    height: b.Ce / 4,
                  });
                  var v = b.lb / 4,
                    Q = {
                      isFloat: !1,
                      isPot: !1,
                      isMipmap: !1,
                      isLinear: !1,
                      width: b.lb,
                      height: v,
                    };
                  h = ba.instance(Q);
                  x = ba.instance(Q);
                  q = ba.instance({
                    isFloat: !1,
                    isPot: !1,
                    isMipmap: !1,
                    isLinear: !0,
                    width: b.lb,
                    height: v * b.Xd,
                  });
                  v = [];
                  Q = [];
                  var X = b.Ri[0],
                    U = b.Ri[1],
                    ia = b.on,
                    O = b.qn,
                    ka = -b.Si[0] + X,
                    Qa = b.Si[1] + U,
                    H = b.pn;
                  v.push(
                    0,
                    X,
                    U,
                    0.5 * -O,
                    ka,
                    Qa,
                    0.5 * O,
                    ka,
                    Qa,
                    0.5 * -ia,
                    X - H,
                    U,
                    0.5 * ia,
                    X - H,
                    U
                  );
                  Q.push(0, 2, 1, 0, 1, 3, 1, 4, 3, 1, 2, 4, 0, 4, 2);
                  B = Y.instance({
                    ka: new Float32Array(v),
                    indices: new Uint16Array(Q),
                  });
                  v = 0.5 - 0.5 / t.kc[1];
                  Q = 0.5 + 0.5 / t.kc[1];
                  X = new Float32Array(16 * b.md);
                  U = new Uint16Array(6 * (b.md - 1));
                  for (ia = 0; ia < b.md; ++ia) {
                    O = (2 * ia) / (b.md - 1) - 1;
                    O = Math.sign(O) * Math.pow(Math.abs(O), b.ll);
                    H = (Math.PI * (O + 1)) / 2 - Math.PI / 2;
                    O = Math.sin(H);
                    var r = Math.cos(H);
                    ka = Math.sin(H * b.Qi);
                    Qa = Math.cos(H * b.Qi);
                    var N = H / (Math.PI * t.kc[0]) + 0.5;
                    H = b.li[0] * O;
                    var ca = b.aj[0],
                      fa = b.li[1] * r + b.wf,
                      ma = N,
                      ya = v,
                      qa = b.aj[1];
                    r = b.mi[1] * r + b.wf;
                    var oa = Q,
                      la = 16 * ia;
                    X[la] = b.mi[0] * O;
                    X[la + 1] = qa;
                    X[la + 2] = r;
                    X[la + 3] = ka;
                    X[la + 4] = 0;
                    X[la + 5] = Qa;
                    X[la + 6] = N;
                    X[la + 7] = oa;
                    X[la + 8] = H;
                    X[la + 9] = ca;
                    X[la + 10] = fa;
                    X[la + 11] = ka;
                    X[la + 12] = 0;
                    X[la + 13] = Qa;
                    X[la + 14] = ma;
                    X[la + 15] = ya;
                    0 !== ia &&
                      ((O = 2 * ia),
                      (ka = 6 * (ia - 1)),
                      (U[ka] = O),
                      (U[ka + 1] = O - 1),
                      (U[ka + 2] = O - 2),
                      (U[ka + 3] = O),
                      (U[ka + 4] = O + 1),
                      (U[ka + 5] = O - 1));
                  }
                  E = Y.instance({ ka: X, indices: U });
                  M.rj(t);
                  C.j("s124", [{ type: "1i", name: "u1", value: 0 }]);
                  f = !0;
                }
              }
            },
            rj: function (t) {
              F = t.Eo;
              g = t.le;
              var v = [
                { type: "1i", name: "u41", value: 1 },
                {
                  type: "3f",
                  name: "u80",
                  value: [t.Ha[0], t.Ha[1] - b.ke[0], t.Ha[2] + b.ke[1]],
                },
              ].concat(t.Tg, t.Vj);
              D = [
                { type: "1i", name: "u178", value: 0 },
                { type: "1i", name: "u163", value: 2 },
                { type: "1f", name: "u180", value: t.Fo },
                { type: "2f", name: "u93", value: [1, 1 / b.Xd] },
                { type: "2f", name: "u179", value: [0, 1 / b.Xd] },
                { type: "1f", name: "u171", value: 1 },
              ].concat(v);
              G = v;
              C.j("s125", D);
              C.j("s126", G);
            },
            ec: function (t) {
              p = t;
            },
            dc: function (t) {
              z = t;
              z.zc(M.Ac);
            },
            Di: function () {
              return l && null !== z && null !== P;
            },
            Ac: function () {
              if (!(l || (u && I)) || null === z || null === P) return !1;
              e = 0;
              c.viewport(0, 0, b.Ce, b.Ce / 4);
              Ea.ba();
              m.u();
              c.clearColor(0, 0, 0, 0);
              c.clear(c.COLOR_BUFFER_BIT);
              C.j("s123", [
                { type: "1f", name: "u174", value: b.wf },
                { type: "1f", name: "u175", value: b.lg[0] },
                { type: "1f", name: "u176", value: b.lg[1] },
                {
                  type: "3f",
                  name: "u146",
                  value: [y[0] + A[0], y[1] + A[1], y[2] + A[2]],
                },
                { type: "1f", name: "u177", value: F },
                { type: "2f", name: "u172", value: b.wm },
                { type: "2f", name: "u173", value: b.Jo },
              ]);
              z.Fl();
              C.set("s1");
              var t = b.lb / 4;
              c.viewport(0, 0, b.lb, t);
              h.u();
              m.h(0);
              m.Ec();
              Y.l(!0, !0);
              for (var v = 0; v < b.Xd; ++v)
                C.set("s124"),
                  0 !== v && c.viewport(0, 0, b.lb, t),
                  x.u(),
                  h.h(0),
                  C.O("u14", 1 / b.lb, 0),
                  Y.l(!1, !1),
                  h.u(),
                  x.h(0),
                  C.O("u14", 0, 1 / t),
                  Y.l(!1, !1),
                  b.ml && c.colorMask(0 === v, 1 === v, 2 === v, !0),
                  C.set("s1"),
                  q.u(),
                  h.h(0),
                  c.viewport(0, v * t, b.lb, t),
                  Y.l(!1, !1),
                  b.ml && c.colorMask(!0, !0, !0, !0);
              return (l = !0);
            },
            W: function () {
              M.Di() &&
                0 === e++ % b.To &&
                (P.bind(!1, !1),
                w.J(),
                c.clearColor(0, 0, 0, 0),
                c.enable(c.DEPTH_TEST),
                c.depthMask(!0),
                c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT),
                C.set("s126"),
                p.h(1),
                B.bind(!0),
                B.W(),
                C.set("s125"),
                q.h(0),
                E.bind(!0),
                E.W(),
                c.disable(c.DEPTH_TEST),
                c.depthMask(!1));
            },
            om: function () {
              return w;
            },
            add: function () {
              M.Di() &&
                (c.enable(c.BLEND),
                c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA),
                w.h(0),
                Y.l(!1, !1),
                c.disable(c.BLEND));
            },
            ug: function (t, v) {
              P && P.remove();
              P = Ea.instance({ width: t, height: v, Hc: !0 });
              w && w.remove();
              w = ba.instance({ width: t, height: v, isFloat: !1, isPot: !1 });
              M.Ac();
            },
            eb: function (t, v, Q) {
              t || ((t = y), (v = A), (Q = k));
              a([
                {
                  type: "3f",
                  name: "u146",
                  value: [
                    Q[0] + g[0],
                    Q[1] + g[1] - b.ke[0],
                    Q[2] + g[2] + b.ke[1],
                  ],
                },
              ]);
              y = t;
              A = v;
              k = Q;
              u = !0;
              !l && I && M.Ac();
              C.M();
            },
            fb: function (t, v) {
              C.j("s123", [{ type: "1f", name: "u147", value: t }]);
              a([{ type: "1f", name: "u147", value: v }]);
              I = !0;
              !l && u && M.Ac();
              C.M();
            },
            zg: function (t) {
              a([{ type: "1f", name: "u81", value: t }]);
              C.M();
            },
            Gb: function (t) {
              t && (z = t);
              M.Ac();
            },
            Ag: function (t, v) {
              L[0].value = 1 - t;
              a(L);
              a(v);
            },
            I: function () {},
            A: function () {
              [P, B, E].forEach(function (t) {
                t && t.remove();
              });
              e = 0;
              u = I = !1;
              E = B = P = g = k = A = y = null;
              l = f = d = !1;
              x = q = m = h = w = p = null;
            },
          };
        return M;
      })();
      za.ua = (function () {
        var a = !1,
          b = null,
          d = 0,
          f = 0,
          l = 0,
          p = [{ type: "1f", name: "u171", value: 1 }],
          w = null,
          h = null,
          m = null,
          q = {
            Sc: function () {
              C.oa("s127", {
                name: "_",
                v: "attribute vec3 a0;uniform vec2 u181,u182;varying vec2 vv0;void main(){vec2 a=2.*(a0.xy-u182)/u181;gl_Position=vec4(a,0.,1.),vv0=a0.xy;}",
                g: "uniform vec2 u90;uniform float u183,u184,u185;varying vec2 vv0;void main(){vec2 b=vec2(sign(vv0.x)*.5*u183,u184),a=vv0-b,c=u185*a,d=(c-a)*u90;gl_FragColor=vec4(d,0.,1.);}",
                i: "u181 u182 u183 u184 u185 u90".split(" "),
                K: ["a0"],
                S: [3],
                precision: "highp",
              });
              C.oa("s128", {
                name: "_",
                v: "attribute vec3 a0;varying vec2 vv0,vv1;uniform sampler2D u41;uniform vec3 u146;uniform vec2 u42,u181,u182;uniform float u147;const float n=0.,o=0.;const vec2 e=vec2(1.);const vec3 p=vec3(1.);const vec2 F=vec2(-1.,1.),q=vec2(.16,.5),r=vec2(.5,.5),s=vec2(.84,.5);uniform mat4 u77;uniform vec3 u80,u84,u85,u86;uniform float u78,u79,u87,u88,u81,u82,u83,u89;mat3 t(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u41,q);vec2 f=u87*e;vec3 c=u87*p;vec2 u=mix(d.a*u42,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u41,r).rgb+vec3(u81,0.,0.),u84,c);float v=mix(texture2D(u41,s).r,0.,u87);a.z+=v;mat3 w=t(a);vec3 x=mix(u146,u85,c);float y=mix(u147,u88,u87);vec3 b=mix(u80,u86,c);b.x+=u78*sin(a.y),b.y+=u79*sin(a.x)*step(0.,a.x);float h=cos(a.z),i=sin(a.z);mat2 z=mat2(h,i,-i,h);b.xy=z*b.xy;float A=mix(u83,1.,u87);vec2 j=u82/u;vec3 k=a0;float B=max(0.,-a0.z-n)*o;k.x+=B*sign(a0.x)*(1.-u87);vec3 C=w*(k+x)*y+b;vec2 D=j*A;vec3 E=vec3(g*D,-j)+C*vec3(1.,-1.,-1.);gl_Position=u77*(vec4(u89*e,e)*vec4(E,1.)),gl_Position*=vec4(-1.,1.,1.,1.),vv0=vec2(.5,.5)+(a0.xy-u182)/u181,vv1=vec2(.5,.5)+.5*gl_Position.xy/gl_Position.w;}",
                g: "uniform sampler2D u186,u187;uniform float u171;varying vec2 vv0,vv1;void main(){vec2 a=u171*texture2D(u186,vv0).rg;gl_FragColor=texture2D(u187,a+vv1);}",
                i: "u171 u41 u186 u187 u181 u182 u42 u80 u147 u146"
                  .split(" ")
                  .concat(C.Cd(), C.Dd()),
                K: ["a0"],
                S: [3],
                precision: "lowp",
              });
              a = !0;
            },
            m: function (x) {
              if (a) {
                if (void 0 === x.jc || !x.od) return !1;
                h = ba.instance({
                  isFloat: !0,
                  isPot: !1,
                  isMipmap: !1,
                  isLinear: !1,
                  width: 256,
                  height: 128,
                  L: 4,
                });
                m = Ea.instance({ width: 256, height: 128 });
                C.j(
                  "s128",
                  [
                    { type: "1i", name: "u41", value: 1 },
                    { type: "1i", name: "u186", value: 2 },
                    { type: "1i", name: "u187", value: 0 },
                    { type: "3f", name: "u80", value: x.Ha },
                    { type: "1f", name: "u171", value: 1 },
                  ].concat(x.Vj, x.Tg)
                );
                f = x.Xe;
                l = x.We;
                d = x.Ye;
              }
            },
            ec: function (x) {
              b = x;
            },
            dc: function (x) {
              w = x;
              w.zc(q.Te);
            },
            Te: function () {
              c.viewport(0, 0, 256, 128);
              m.u();
              h.u();
              var x = w.pm(),
                I = w.qm(),
                u = [
                  { type: "2f", name: "u181", value: [x, I] },
                  { type: "2f", name: "u182", value: [w.Tl(), w.Ul()] },
                ];
              C.j(
                "s127",
                u.concat([
                  { type: "1f", name: "u183", value: f },
                  { type: "1f", name: "u184", value: l },
                  { type: "1f", name: "u185", value: d },
                  { type: "2f", name: "u90", value: [1 / x, -1 / I] },
                ])
              );
              w.Dh();
              C.j("s128", u);
            },
            W: function () {
              C.set("s128");
              b.h(1);
              h.h(2);
              w.Dh();
            },
            eb: function (x) {
              C.j("s128", [{ type: "3f", name: "u146", value: x }]);
              C.M();
            },
            fb: function (x) {
              C.j("s128", [{ type: "1f", name: "u147", value: x }]);
              C.M();
            },
            zg: function (x) {
              C.j("s128", [{ type: "1f", name: "u81", value: x }]);
              C.M();
            },
            Co: function (x) {
              d = x;
              q.Te();
              C.M();
              Ba.animate(Date.now());
            },
            Gb: function (x) {
              x && (w = x);
              q.Te();
            },
            Ag: function (x, I) {
              p.u171 = 1 - x;
              C.j("s128", p);
              C.j("s128", I);
            },
            I: function () {},
          };
        return q;
      })();
      za.rc = (function () {
        var a = [0, -0.5],
          b = !1,
          d = !1,
          f = null,
          l = null,
          p = null,
          w = null,
          h = null,
          m = -1,
          q = -1;
        return {
          Sc: function () {
            C.oa("s129", {
              name: "_",
              v: "attribute vec2 a0;uniform sampler2D u41;uniform vec2 u42,u11;uniform float u10;varying vec2 vv0;const vec2 f=vec2(1.,1.);void main(){vec4 a=texture2D(u41,vec2(.25,.5));vec2 b=a.a*u42,c=2.*a.gb-f,d=u11+a0*u10;gl_Position=vec4(c+b*d,0.,1.),vv0=vec2(.5,.5)+.5*a0;}",
              g: "uniform sampler2D u188;varying vec2 vv0;void main(){gl_FragColor=texture2D(u188,vv0);}",
              i: ["u41", "u188", "u42", "u11", "u10"],
              precision: "lowp",
            });
            C.oa("s130", {
              name: "_",
              g: "uniform sampler2D u2,u189,u190;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){float a=texture2D(u2,vv0).r;vec3 b=texture2D(u190,vv0).rgb,c=texture2D(u189,vv0).rgb;gl_FragColor=vec4(mix(b,c,a*f),1.);}",
              i: ["u2", "u190", "u189"],
              precision: "lowp",
            });
            b = !0;
          },
          m: function (x) {
            b &&
              ((h = ba.instance({
                isFloat: !1,
                isPot: !0,
                url: x.Ke,
                D: function () {
                  d = !0;
                },
              })),
              C.j("s129", [
                { type: "1i", name: "u41", value: 1 },
                { type: "1i", name: "u188", value: 0 },
                { type: "2f", name: "u42", value: x.ek },
                { type: "2f", name: "u11", value: a },
                { type: "1f", name: "u10", value: 3.8 },
              ]),
              C.j("s130", [
                { type: "1i", name: "u189", value: 0 },
                { type: "1i", name: "u2", value: 1 },
                { type: "1i", name: "u190", value: 2 },
              ]));
          },
          ec: function (x) {
            l = x;
          },
          ug: function (x, I) {
            var u = {
              isFloat: !1,
              isPot: !1,
              isMipmap: !1,
              isLinear: !1,
              width: x,
              height: I,
              L: 4,
            };
            m = 2 / x;
            q = 2 / I;
            p = ba.instance(u);
            w = ba.instance(u);
            f = Ea.instance({ width: x, height: I });
          },
          W: function (x, I) {
            if (d) {
              f.bind(!1, !0);
              C.set("s91");
              for (var u = 0; 2 > u; ++u) {
                C.O("u14", m, 0);
                p.u();
                0 !== u && w.h(0);
                var y = 0 === u && !W.ga_;
                Y.l(y, y);
                C.O("u14", 0, q);
                w.u();
                p.h(0);
                Y.l(!1, !1);
              }
              C.set("s129");
              l.h(1);
              h.h(0);
              p.u();
              c.clearColor(1, 0, 0, 1);
              c.clear(c.COLOR_BUFFER_BIT);
              Y.l(!1, !1);
              C.set("s130");
              I.u();
              w.h(0);
              p.h(1);
              x.h(2);
              Y.l(!1, !1);
            }
          },
          I: function () {},
        };
      })();
      var fd = (function () {
        var a = {
          instance: function (b) {
            var d = b.Zf,
              f = b.Uf,
              l = b.nd,
              p = b.background ? b.background : ba.ii(),
              w = b.pa,
              h = { scale: 1, offsetX: 0, offsetY: 0 },
              m = null;
            b.Tf && ((h.scale = b.Tf.scale), (h.offsetY = b.Tf.offsetY));
            return {
              ci: function () {
                return w;
              },
              Vh: function () {
                return p;
              },
              set: function () {
                m = gb.em();
                gb.yj(h);
                gb.ue();
                gb.ve();
                Ba.qj(l, p, !1, !1);
              },
              M: function () {
                gb.yj(m);
              },
              cc: function () {
                return {
                  modelURL: d,
                  materialsURLs: f,
                  background: p.cc(!1),
                  nd: l.cc(!1),
                  pa: w.cc(!0),
                };
              },
              hm: function () {
                return l.cc(!1);
              },
              xp: function (q) {
                p.h(q);
              },
              I: function () {
                l.remove();
                w.remove();
                b.background && p.remove();
              },
            };
          },
          Zc: function (b, d, f) {
            function l() {
              if (3 === ++m && d) {
                var q = a.instance({
                  Zf: b.modelURL,
                  Uf: b.materialsURLs,
                  background: p,
                  nd: w,
                  pa: h,
                });
                d(q);
              }
            }
            var p = null,
              w = null,
              h = null,
              m = 0;
            ba.Zc(b.background, function (q) {
              !q && f ? f() : ((p = q), l());
            });
            ba.Zc(b.dataState, function (q) {
              !q && f ? f() : ((w = q), l());
            });
            ba.Zc(b.light, function (q) {
              !q && f ? f() : ((h = q), l());
            });
          },
        };
        return a;
      })();
      return Lb || window.ARLOOK;
    })(),
    wd = (function () {
      function S(ua, Ga) {
        var Ka = Object.prototype.toString.call(ua),
          vb = 0,
          La = ua.length;
        if (
          "[object Array]" === Ka ||
          "[object NodeList]" === Ka ||
          "[object HTMLCollection]" === Ka ||
          "[object Object]" === Ka ||
          ("undefined" !== typeof jQuery && ua instanceof jQuery) ||
          ("undefined" !== typeof Elements && ua instanceof Elements)
        )
          for (; vb < La; vb++) Ga(ua[vb]);
        else Ga(ua);
      }
      var V = function (ua, Ga) {
        function Ka() {
          var La = [];
          this.add = function (Gb) {
            La.push(Gb);
          };
          var kb, zb;
          this.call = function () {
            kb = 0;
            for (zb = La.length; kb < zb; kb++) La[kb].call();
          };
          this.remove = function (Gb) {
            var Pb = [];
            kb = 0;
            for (zb = La.length; kb < zb; kb++)
              La[kb] !== Gb && Pb.push(La[kb]);
            La = Pb;
          };
          this.length = function () {
            return La.length;
          };
        }
        function vb(La, kb) {
          if (La)
            if (La.resizedAttached) La.resizedAttached.add(kb);
            else {
              La.resizedAttached = new Ka();
              La.resizedAttached.add(kb);
              La.resizeSensor = document.createElement("div");
              La.resizeSensor.className = "resize-sensor";
              La.resizeSensor.style.cssText =
                "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
              La.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s;"></div></div><div class="resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%"></div></div>';
              La.appendChild(La.resizeSensor);
              La.resizeSensor.offsetParent !== La &&
                (La.style.position = "relative");
              var zb = La.resizeSensor.childNodes[0],
                Gb = zb.childNodes[0],
                Pb = La.resizeSensor.childNodes[1],
                ac,
                Mb,
                lc,
                Nb,
                mc = La.offsetWidth,
                wc = La.offsetHeight,
                xc = function () {
                  Gb.style.width = "100000px";
                  Gb.style.height = "100000px";
                  zb.scrollLeft = 1e5;
                  zb.scrollTop = 1e5;
                  Pb.scrollLeft = 1e5;
                  Pb.scrollTop = 1e5;
                };
              xc();
              var yc = function () {
                Mb = 0;
                ac &&
                  ((mc = lc),
                  (wc = Nb),
                  La.resizedAttached && La.resizedAttached.call());
              };
              kb = function () {
                lc = La.offsetWidth;
                Nb = La.offsetHeight;
                (ac = lc != mc || Nb != wc) &&
                  !Mb &&
                  (Mb = window.requestAnimationFrame(yc));
                xc();
              };
              var nc = function (bc, zc, oc) {
                bc.attachEvent
                  ? bc.attachEvent("on" + zc, oc)
                  : bc.addEventListener(zc, oc);
              };
              nc(zb, "scroll", kb);
              nc(Pb, "scroll", kb);
            }
        }
        S(ua, function (La) {
          vb(La, Ga);
        });
        this.detach = function (La) {
          V.detach(ua, La);
        };
      };
      V.detach = function (ua, Ga) {
        S(ua, function (Ka) {
          if (Ka) {
            if (
              Ka.resizedAttached &&
              "function" == typeof Ga &&
              (Ka.resizedAttached.remove(Ga), Ka.resizedAttached.length())
            )
              return;
            Ka.resizeSensor &&
              (Ka.contains(Ka.resizeSensor) && Ka.removeChild(Ka.resizeSensor),
              delete Ka.resizeSensor,
              delete Ka.resizedAttached);
          }
        });
      };
      return V;
    })(),
    Kb = {
      glassesDBURL: "/MyApp_AR/api/gl/",
      appstaticURL: "https://appstatic.jeeliz.com/",
      autoVTOURL: "",
      assetsPath: "jeefit/",
    },
    ob = {
      notLoaded: -1,
      initializing: 0,
      realtime: 2,
      loadingModel: 3,
      paused: 4,
    },
    ud = {
      isRT: !0,
      sku: void 0,
      materialsReplacements: "",
      mode: ob.notLoaded,
    },
    Sa = Object.assign({}, ud),
    fb = {
      displayWidth: -1,
      displayHeight: -1,
      cvWidth: -1,
      cvHeight: -1,
      oFactor: -1,
    },
    vd = {
      cv: null,
      container: null,
      adjust: null,
      adjustNotice: null,
      adjustExit: null,
      loading: null,
      trackIframe: null,
    },
    hc = null,
    Tb = null,
    Ca = Object.assign({}, vd),
    de = {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: null,
      LOADING_END: null,
    },
    ad = null,
    $b = { enabled: !1, callback: null, interval: 1e3 },
    Hc = { error: null },
    uc = null,
    jc = null,
    kc = Kb.appstaticURL + Kb.assetsPath,
    Wa = Lb,
    wb = {
      start: function (S) {
        var V = Object.assign(
          {
            settings: null,
            NNCPath: null,
            assetsPath: Kb.appstaticURL + Kb.assetsPath,
            catalog: null,
            faceDetectionCallback: null,
            faceDetectionInterval: 1e3,
            placeHolder: null,
            canvas: null,
            onError: null,
            callbackReady: null,
            onWebcamGet: null,
            callbacks: {},
            searchImageMask: null,
            searchImageColor: null,
            searchImageRotationSpeed: null,
            isShadow: !0,
            isRequestCamera: !0,
            sku: null,
            modelStandalone: null,
          },
          S
        );
        console.log("INFO in ARLookWidget.js: start()");
        return new Promise(function (ua, Ga) {
          if (Sa.mode !== ob.notLoaded)
            wb.resume()
              .catch(function (vb) {})
              .finally(ua);
          else {
            na();
            if (V.settings) for (var Ka in V.settings) Kb[Ka] = V.settings[Ka];
            V.NNCPath && Wa.set_NNCPath(V.NNCPath);
            V.faceDetectionCallback &&
              (($b.enabled = !0),
              ($b.callback = V.faceDetectionCallback),
              ($b.interval = V.faceDetectionInterval));
            ad = Object.assign({}, de, V.callbacks);
            Ca.container =
              V.placeHolder || document.getElementById("ARLookWidget");
            if (!Ca.container)
              throw Error(
                "Cannot find a <div> element with id=ARLookWidget to append the VTO widget."
              );
            Ca.cv = V.canvas || document.getElementById("ARLookWidgetCanvas");
            Ca.cv ||
              ((Ca.cv = document.createElement("canvas")),
              Ca.container.appendChild(Ca.cv));
            Ca.cv.style.position = "absolute";
            Ca.loading = document.getElementById("ARLookWidgetLoading");
            Hc.error = V.onError;
            jc = V.callbackReady;
            ic();
            Ka = qb(Ca.container);
            if (!Ka.width) return Promise.reject("PLACEHOLDER_NULL_WIDTH");
            if (!Ka.height) return Promise.reject("PLACEHOLDER_NULL_HEIGHT");
            Sb(!0);
            Ic();
            (V.searchImageMask ||
              V.searchImageColor ||
              V.searchImageRotationSpeed) &&
              Wa.set_loading(
                V.searchImageMask,
                V.searchImageColor,
                V.searchImageRotationSpeed
              );
            Sa.mode = ob.initializing;
            kc = V.assetsPath;
            uc = V.catalog;
            if (V.onWebcamGet) Wa.onWebcamGet(V.onWebcamGet);
            Wa.init2({
              basePath: kc,
              cv: Ca.cv,
              width: fb.cvWidth,
              height: fb.cvHeight,
              isRequestCamera: V.isRequestCamera,
              callbackReady: ja,
            }).catch(function (vb) {
              Sa.isRT = !1;
              sb(vb || "NO_ERROR_LABEL");
              Ga();
            });
            Wa.onHalfLoad(function () {
              !1 === V.isShadow && Wa.switch_shadow(!1);
              V.sku
                ? wb.load_glassesDB(V.sku, ua, V.materialsReplacements)
                : V.modelStandalone
                ? wb.load_modelStandalone(V.modelStandalone, ua)
                : ua();
            });
          }
        });
      },
      destroy: function () {
        return Wa.destroy().then(function () {
          Object.assign(Sa, ud);
          jc = uc = null;
          Object.assign(Ca, vd);
        });
      },
      preFetch: function (S) {
        Bd(S).then(function (V) {
          V && !V.includes("://") && (V = kc + "models3D/" + V);
          Wa.preFetch(kc, V ? [V] : []);
        });
      },
      pause: function (S) {
        if (!Sa.isRT || !Wa.ready) return Promise.reject();
        Sa.mode = ob.paused;
        Tb && Tb.detach();
        Tb = null;
        var V = Wa.switch_sleep(!0, S);
        return S ? V : Promise.resolve(V);
      },
      resume: function (S) {
        if (!Sa.isRT || !Wa.ready) return Promise.reject();
        Sa.mode = ob.realtime;
        Ic();
        var V = Wa.switch_sleep(!1, S);
        return S ? V : Promise.resolve(V);
      },
      set_videoRotation: function (S) {
        Sa.isRT && Wa.set_videoRotation(S);
      },
      set_videoSizes: function (S, V, ua, Ga, Ka, vb) {
        Sa.isRT && Wa.set_videoSizes(S, V, ua, Ga, Ka, vb);
      },
      resize: function () {
        hc && clearTimeout(hc);
        hc = setTimeout(function () {
          hc && clearTimeout(hc);
          hc = null;
          Sb(!0);
        }, 50);
      },
      set_scale: function (S) {
        Wa.set_scale(S);
      },
      reset_resizeSensor: Ic,
      capture_image: function (S, V, ua) {
        Wa && Wa.ready ? Wa.capture_image(S, V, ua, !1) : V(!1);
      },
      toggle_loading: function (S) {
        S
          ? (sa(Ca.loading), vc("LOADING_START"))
          : (Pa(Ca.loading), vc("LOADING_END"));
      },
      load_modelStandalone: function (S, V) {
        if (Sa.mode === ob.notLoaded)
          throw Error("You should call ARLookWIDGE.start() first");
        if (!Sa.isRT)
          throw Error("Loading standalone models is only available in RT mode");
        Sa.mode === ob.paused && wb.resume().catch(function (Ka) {});
        Sa.mode = ob.loadingModel;
        wb.toggle_loading(!0);
        var ua = function () {
            wb.toggle_loading(!1);
            V && V();
          },
          Ga = "undef";
        "string" === typeof S
          ? ((Ga = S), Ua(S, Ga).then(ua).catch(eb))
          : ((Ga = "RANDOM_SKU_" + Date.now().toString()), Xc(Ga, S, ua));
        Sa.sku = Ga;
        Sa.materialsReplacements = "";
      },
      //gère le chargement des données associées à des lunettes à partir d'une base de données
      //, en prenant en compte différents scénarios et en utilisant une approche asynchrone pour récupérer les données et les traiter.
      load_glassesDB: function (S, V, ua) {
        if (Sa.mode === ob.notLoaded)
          throw Error("You should call ARLookWIDGET.start() first");
        if (Sa.isRT) {
          wb.toggle_loading(!0);
          var Ga = ua ? JSON.stringify(ua) : "";
          S === Sa.sku && Ga === Sa.materialsReplacements
            ? (wb.toggle_loading(!1), V && V())
            : ((Sa.sku = S),
              (Sa.materialsReplacements = Ga),
              (Sa.mode = ob.loadingModel),
              Sa.mode === ob.paused && wb.resume().catch(function (Ka) {}),
              S
                ? uc && uc[S]
                  ? $c(S, uc[S], V, ua)
                  : va(Kb.glassesDBURL + S)
                      .then(function (Ka) {
                        if (Ka.error) return eb();
                        $c(S, Ka.intrinsic, V, ua);
                      })
                      .catch(eb)
                : ((Sa.mode = ob.realtime),
                  wb.toggle_loading(!1),
                  Wa.start_rendering(),
                  V && V()));
        }
      },
      enter_adjustMode: yb,
      exit_adjustMode: Fb,
      set_LUT: function (S) {
        return Wa && Wa.ready
          ? Wa.set_LUT(S || null)
          : Promise.reject("NOT_READY");
      },
      tweak_autoVTOModel: Wc,
    };
  return wb;
})();
window.ARLOOK = ARLOOK;
window.ARLOOKWIDGET = {
  VERSION: ARLOOK.VERSION,
  capture_image: ARLookWidget.capture_image,
  destroy: ARLookWidget.destroy,
  enter_adjustMode: ARLookWidget.enter_adjustMode,
  exit_adjustMode: ARLookWidget.exit_adjustMode,
  load: ARLookWidget.load_glassesDB,
  load_modelStandalone: ARLookWidget.load_modelStandalone,
  pause: ARLookWidget.pause,
  preFetch: ARLookWidget.preFetch,
  request_cameraVideoStream: ARLOOK.request_cameraVideoStream,
  reset_resizeSensor: ARLookWidget.reset_resizeSensor,
  resize: ARLookWidget.resize,
  resume: ARLookWidget.resume,
  set_LUT: ARLookWidget.set_LUT,
  set_scale: ARLookWidget.set_scale,
  set_videoRotation: ARLookWidget.set_videoRotation,
  set_videoSizes: ARLookWidget.set_videoSizes,
  start: ARLookWidget.start,
  tweak_autoVTOModel: ARLookWidget.tweak_autoVTOModel,
};

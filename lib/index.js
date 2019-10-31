const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    dataPosition: null,
    dataPreKeyword: '',
    dataPosKeyword: '',
    dataPreTxtbody: '',
    dataPosTxtbody: '',
    dataReplaceMode: 1,
    dataKeywordRowHeight: 2,
    dataTxtBodyRowHeight: 15,
    dataKeywordList: [],
    dataSelectedList: '',
    dataDictionary: {
      normalReplace: {
        japanese: '正規表現なし置換',
        icon: '［N］',
      },
      regularReplace: {
        japanese: '正規表現あり置換',
        icon: '［R］',
      },
      placeholder: {
        preKeyword: "置換前文字列",
        posKeyword: "置換後文字列",
        preTxtbody: "変更前テキスト",
        posTxtbody: "変更後テキスト",
      },
      label: {
        selectKeywordSet: " Keyword set",
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.methodHandleScroll);

    //localstorage からデータ取り出し
    this.setDataPreKeyword(this.getLocalStorageDataPreKeyword());
    this.setDataPosKeyword(this.getLocalStorageDataPosKeyword());
    this.setDataPreTxtbody(this.getLocalStorageDataPreTxtbody());
    this.setDataReplaceMode(this.getLocalStorageDataReplaceMode());
    this.setDataKeywordList(this.getLocalStorageDataKeywordList());

    this.methodClickReplaceMode();
    document.getElementById("app").style.display = "";
  },

  methods: {
    // マウント時のみ起動
    methodClickReplaceMode() {
      if (this.getDataReplaceMode() == 1) {
        document.getElementById("mode1").click();
      } else {
        document.getElementById("mode2").click();
      }
    },

    methodDeleteKeywordSetList() {
      const dataPreKeyword = this.getDataPreKeyword();
      const dataPosKeyword = this.getDataPosKeyword();
      const dataReplaceMode = this.getDataReplaceMode();

      const tempDataKeywordList = this.getDataKeywordList().filter(function (value) {
        if (
          value['pre'] == dataPreKeyword &&
          value['pos'] == dataPosKeyword &&
          value['mode'] == dataReplaceMode
        ) {
          console.log("deleted : " + value['summary']);
        } else {
          return value;
        }
      })

      this.setDataKeywordList(tempDataKeywordList);
    },

    methodTxtBodyRemove() {
      this.setDataPreTxtbody("");
    },

    methodPreKeywordRemove() {
      this.setDataPreKeyword("");
    },

    methodPosKeywordRemove() {
      this.setDataPosKeyword("");
    },
    methodAddKeywordSetList() {
      const dataDictionary = this.getDataDictionary();
      const aliasMode = this.getDataReplaceMode() == 1 ? dataDictionary.normalReplace.icon + '：' :
        dataDictionary.regularReplace.icon + '：';
      const aliasPre = this.getDataPreKeyword().replace(/\r?\n/g, '↓').replace(/\t/g, '→');
      const aliasPos = this.getDataPosKeyword().replace(/\r?\n/g, '↓').replace(/\t/g, '→');
      const summary = aliasMode + '［' + aliasPre + '］ー［' + aliasPos + '］';
      const set = {
        "summary": summary,
        "mode": this.getDataReplaceMode(),
        "pre": this.getDataPreKeyword(),
        "pos": this.getDataPosKeyword(),
      };
      const dataKeywordList = this.getDataKeywordList();
      dataKeywordList.push(set);
      this.setDataKeywordList(dataKeywordList);
    },

    methodSelectKeywordSet() {
      const dataSelectedList = this.getDataSelectedList();
      this.setDataReplaceMode(dataSelectedList['mode']);
      this.setDataPreKeyword(dataSelectedList['pre']);
      this.setDataPosKeyword(dataSelectedList['pos']);

      this.methodControlReplace();
    },

    methodHandleScroll() {
      this.setDataPosition(document.documentElement.scrollTop || document.body.scrollTop);
    },

    methodInsertTab(event) {
      const tabchar = "\t"
      const targetID = event.target.id;
      const obj = document.getElementById(targetID);
      const sPos = obj.selectionStart;
      const ePos = obj.selectionEnd;
      const addStr = obj.value.substr(0, sPos) + tabchar + obj.value.substr(ePos);
      const cPos = sPos + tabchar.length;
      obj.value = addStr;

      switch (targetID) {
        case "idPreKeyword":
          this.setDataPreKeyword(addStr);
          break;
        case "idPosKeyword":
          this.setDataPosKeyword(addStr);
          break;
        case "idPreTxtbody":
          this.setDataPreTxtbody(addStr);
          break;
      }

      obj.setSelectionRange(cPos, cPos); // 文字選択状態を初期の状態へ

    },

    methodControlReplace() {
      if (this.dataPreKeyword != "") {
        const dataPreKeyword = this.getDataPreKeyword();
        const dataPosKeyword = this.getDataPosKeyword();
        const dataPreTxtbody = this.getDataPreTxtbody();

        const dataReplaceMode = this.getDataReplaceMode();
        let dataPosTxtbody = "";
        switch (dataReplaceMode) {
          case 1:
            dataPosTxtbody = dataPreTxtbody.split(dataPreKeyword).join(dataPosKeyword);
            break;
          case 2:
            dataPosTxtbody = dataPreTxtbody.replace(new RegExp(dataPreKeyword, "g"),
              dataPosKeyword);
            break;
        }
        this.setDataPosTxtbody(dataPosTxtbody);
        this.setLocalStorageDataPreKeyword(dataPreKeyword);
        this.setLocalStorageDataPosKeyword(dataPosKeyword);

        // 置換後に置換済みテキストを置換前テキストとして保存
        this.setLocalStorageDataPreTxtbody(dataPosTxtbody);
      }
    },

    methodClassAplly(select) {
      const one = select;
      const two = this.getDataReplaceMode();
      const applyColor = one === two ? "purple lighten-3  font_mono" : "grey font_mono";
      return applyColor;
    },

    methodChangeMode(select) {
      this.setDataReplaceMode(select);
      this.methodControlReplace();
    },

    // getter _______________
    getDataPreKeyword() {
      return this.dataPreKeyword;
    },
    getDataPosKeyword() {
      return this.dataPosKeyword;
    },

    getDataReplaceMode() {
      return this.dataReplaceMode;
    },

    getDataKeywordList() {
      return this.dataKeywordList;
    },

    getDataSelectedList() {
      return this.dataSelectedList;
    },

    getDataPreTxtbody() {
      return this.dataPreTxtbody;
    },

    getDataDictionary() {
      return this.dataDictionary;
    },



    getLocalStorageDataPreKeyword() {
      return localStorage.getItem("dataPreKeyword") || "";
    },

    getLocalStorageDataPosKeyword() {
      return localStorage.getItem("dataPosKeyword") || "";
    },

    getLocalStorageDataPreTxtbody() {
      return localStorage.getItem("dataPreTxtbody") || "";
    },

    getLocalStorageDataReplaceMode() {
      return localStorage.getItem("dataReplaceMode") || 1;
    },

    getLocalStorageDataKeywordList() {
      return JSON.parse(localStorage.getItem("dataKeywordList")) || [];
    },


    // setter _______________
    setDataPreKeyword(context) {
      this.dataPreKeyword = context;
      this.setLocalStorageDataPreKeyword(context);
    },
    setDataPosKeyword(context) {
      this.dataPosKeyword = context;
      this.setLocalStorageDataPosKeyword(context);
    },
    setDataPreTxtbody(context) {
      this.dataPreTxtbody = context;
      this.setLocalStorageDataPreTxtbody(context);
    },

    setDataPosTxtbody(context) {
      this.dataPosTxtbody = context;
    },

    setDataReplaceMode(context) {
      this.dataReplaceMode = context;
      this.setLocalStorageDataReplaceMode(context);
    },
    setDataKeywordList(context) {
      this.dataKeywordList = context;
      this.setLocalStorageDataKeywordList(JSON.stringify(context));
    },
    setDataPosition(context) {
      this.dataPosition = context;
    },

    setLocalStorageDataPreKeyword(context) {
      localStorage.setItem("dataPreKeyword", context);
    },

    setLocalStorageDataPosKeyword(context) {
      localStorage.setItem("dataPosKeyword", context);
    },

    setLocalStorageDataPreTxtbody(context) {
      localStorage.setItem("dataPreTxtbody", context);
    },

    setLocalStorageDataReplaceMode(context) {
      localStorage.setItem("dataReplaceMode", context);
    },

    setLocalStorageDataKeywordList(context) {
      localStorage.setItem("dataKeywordList", context);
    },


  }
})

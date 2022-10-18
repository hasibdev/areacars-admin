// Config for Searchable Select
export const areaFieldConfig = {
   name: "Bereich",
   dataUrl: "/admin/area",
   postUrl: "/admin/area/store",
   deleteUrl: "/admin/area/delete",
   dataField: "areas",
   deleteTitle: "Bereich löschen",
   deleteMessage: "Möchten Sie diesen Bereich wirklich entfernen?",
   fields: [
      {
         name: "area_name",
         image: false,
         label: "Name",
      },
   ],
   form: {
      area_name: '',
   }
}

export const categoryFieldConfig = {
   name: "Kategorie",
   dataUrl: "/admin/category",
   postUrl: "/admin/category/store",
   deleteUrl: "/admin/category/delete",
   dataField: "",
   deleteTitle: "Kategorie löschen",
   deleteMessage: "Möchten Sie diese Kategorie wirklich entfernen?",
   fields: [
      {
         name: "cat_name",
         image: false,
         label: "Name",
      },
      {
         name: "icon",
         image: true,
         label: "Bild",
      },
   ],
   form: {
      cat_name: '',
      icon: '',
   }
}

export const brandFieldConfig = {
   name: "Hersteller",
   dataUrl: "/admin/brand",
   postUrl: "/admin/brand/store",
   deleteUrl: "/admin/brand/delete",
   dataField: "brans",
   deleteTitle: "Hersteller löschen",
   deleteMessage: "Möchten Sie diesen Hersteller wirklich entfernen?",
   fields: [
      {
         name: "brand_name",
         image: false,
         label: "Name",
      },
      {
         name: "brand_images",
         image: true,
         label: "Markenlogo",
      },
   ],
   form: {
      brand_name: '',
      brand_images: '',
   }
}

export const gearboxFieldConfig = {
   name: "Getriebe",
   dataUrl: "/admin/gearbox",
   postUrl: "/admin/gearbox/store",
   deleteUrl: "/admin/gearbox/delete",
   dataField: "gearboxs",
   deleteTitle: "Getriebe löschen",
   deleteMessage: "Möchten Sie diesen Getriebe wirklich entfernen?",
   fields: [
      {
         name: "gearshift_name",
         image: false,
         label: "Name",
      },
   ],
   form: {
      gearshift_name: '',
   }
}

export const exteriorColorFieldConfig = {
   name: "Außenfarbe",
   dataUrl: "/admin/color",
   postUrl: "/admin/color/store",
   deleteUrl: "/admin/color/delete",
   dataField: "colors",
   colorTrack: 'color_code',
   colorNameTrack: 'color_name',
   deleteTitle: "Farbe löschen",
   deleteMessage: "Möchten Sie diese Außenfarbe wirklich entfernen?",
   fields: [
      {
         name: "color_name",
         image: false,
         label: "Name",
      },
      {
         name: "color_code",
         image: false,
         label: "Farbcode",
      },
   ],
   form: {
      color_name: '',
      color_code: '',
   }
}
export const interiorColorFieldConfig = {
   name: "Innenausstattungsfarbe",
   dataUrl: "/admin/color",
   postUrl: "/admin/color/store",
   deleteUrl: "/admin/color/delete",
   dataField: "colors",
   colorTrack: 'color_code',
   colorNameTrack: 'color_name',
   deleteTitle: "Farbe löschen",
   deleteMessage: "Möchten Sie diese Innenausstattungsfarbe wirklich entfernen?",
   fields: [
      {
         name: "color_name",
         image: false,
         label: "Name",
      },
      {
         name: "color_code",
         image: false,
         label: "Farbcode",
      },
   ],
   form: {
      color_name: '',
      color_code: '',
   }
}

export const interiorMaterialFieldConfig = {
   name: "Innenmaterial",
   dataUrl: "/admin/interiormaterial",
   postUrl: "/admin/interiormaterial/store",
   deleteUrl: "/admin/interiormaterial/delete",
   dataField: "interiormaterial",
   deleteTitle: "Innenmaterial löschen",
   deleteMessage: "Möchten Sie dieses Innenmaterial wirklich entfernen?",
   fields: [
      {
         name: "imaterial_name",
         image: false,
         label: "Name",
      },
   ],
   form: {
      imaterial_name: ''
   }
}

export const upholsterycolorsFieldConfig = {
   name: "Polsterfarbe",
   dataUrl: "/admin/upholsterycolor",
   postUrl: "/admin/upholsterycolor/store",
   deleteUrl: "/admin/upholsterycolor/delete",
   dataField: "upholsterycolor",
   colorTrack: 'has_code',
   colorNameTrack: 'upholsterycolors',
   deleteTitle: "Polsterfarbe löschen",
   deleteMessage: "Möchten Sie diese Polsterfarbe wirklich entfernen?",
   fields: [
      {
         name: "upholsterycolors",
         image: false,
         label: "Name",
      },
      {
         name: "has_code",
         image: false,
         label: "Farbcode",
      },
   ],
   form: {
      upholsterycolors: '',
      has_code: ''
   }
}

export const fuelFieldConfig = {
   name: "Kraftstoff",
   dataUrl: "/admin/fuel",
   postUrl: "/admin/fuel/store",
   deleteUrl: "/admin/fuel/delete",
   dataField: "fuels",
   deleteTitle: "Kraftstoff löschen",
   deleteMessage: "Möchten Sie diesen Kraftstoff wirklich entfernen?",
   fields: [
      {
         name: "fuel_name",
         image: false,
         label: "Name",
      },
   ],
   form: {
      fuel_name: ''
   }
}

export const modelFieldConfig = {
   name: "Modell",
   dataUrl: "/admin/model",
   postUrl: "/admin/model/store",
   deleteUrl: "/admin/model/delete",
   dataField: "data",
   deleteTitle: "Modell löschen",
   deleteMessage: "Möchten Sie dieses Modell wirklich entfernen?",
   fields: [
      {
         name: "brand_id",
         image: false,
         label: "Hersteller",
         options: [],
         optionLabel: "brand_name"
      },
      {
         name: "model_name",
         image: false,
         label: "Modell",
      },
   ],
   form: {
      brand_id: '',
      model_name: '',
   }
}

export const templateFieldConfig = {
   name: "Vorlage",
   dataUrl: "/admin/template",
   postUrl: "/admin/template/store",
   deleteUrl: "/admin/template/delete",
   dataField: "data",
   deleteTitle: "Vorlage löschen",
   deleteMessage: "Möchten Sie diese Vorlage wirklich entfernen?",
}

export const modelWiseVehicle = {
   name: "Model Wise",
   dataUrl: "/admin/push_notifactions/getmodelwisevichle",
   postUrl: "",
   deleteUrl: "",
   dataField: "data",
   deleteTitle: "",
   deleteMessage: "",
   fields: [],
   form: {}
}

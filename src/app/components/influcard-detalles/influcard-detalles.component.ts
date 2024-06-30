import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Influcard } from '../../models/influcard-model';
import { InflucardService } from '../../services/influcard.service';
import { CommonModule } from '@angular/common';

import { Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


@Component({
  selector: 'app-influcard-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './influcard-detalles.component.html',
  styleUrl: './influcard-detalles.component.css'
})
export class InflucardDetallesComponent {
  // Influcard que consultaremos
  influcard?: Influcard;

  private _route = inject(ActivatedRoute);
  private _influcardService = inject(InflucardService);
  
  private roots: am5.Root[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {}
 
  // Porcentaje Reach formateado para el svg
  get reachPercentage(): string {
    return `${this.influcard?.reach_formated_graph || 0}, 100`;
  }

  // Porcentaje Relevance formateado para el svg
  get relevancePercentage(): string {
    return `${this.influcard?.relevance_formated_graph || 0}, 100`;
  }
  
  // Porcentaje Resonance formateado para el svg
  get resonancePercentage(): string {
    return `${this.influcard?.resonance_formated_graph || 0}, 100`;
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    
    /* MANTENER ESTA FUNCION AL TERMINAR PROYECTO: */
    /* // Se busca la influcard de la que vamos a ver detalles
    this.influcard = this._influcardService.getInflucardData(); */

    /* Obtenerlo directamente al entrar (TEMPORAL - BORRAR AL TERMINAR) */
    this._influcardService.getInflucardById("4__4355072").subscribe ({
      next: (data?: Influcard) => {
        this.influcard = data;

        // Guardar influcard encontrado en el servicio influcard
        this._influcardService.setInflucardData(data);

        /* this.ngAfterViewInit(); */
      },
      error: (err) => {

        console.error('Error obteniendo datos de Influcard:', err);
      }
    });



  }

  descargarInflucard(): void {
    /* ... */
  }

  ngAfterViewInit() {
    this.browserOnly(() => {
      if (this.influcard) {
        /* Funciones por cada amchart del componente: */

        /* Amchart 1: Distribucion posts por genero */
        this.createGenderDistributionChart(
          this.influcard.insight_perc_m,
          this.influcard.insight_perc_f
        );

        /* Amchart 2: Distribucion posts por territorios */
        this.createTerritoryDistributionChart();


        /* Amchart 3: Franja horaria publicaciones */
        this.createPostsTimeSlotChart();


        /* Amchart 4: Engagement posts por dia de publicacion */
        this.createEngagementRateChart();

        /* this.createRelevanceChart(
          this.influcard.reach_formated_graph || 0,
          this.influcard.relevance_formated_graph || 0
        ); */
      }
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      this.roots.forEach(root => root.dispose());
    });
  }

  /* Amchart 1: Distribucion por genero */
  private createGenderDistributionChart(value1: string, value2: string): void {

    // Valores a number
    value1 = value1 + 0;
    value2 = value2 + 0;

    let root = am5.Root.new("chartdiv1");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    }));

    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category"
    }));

    series.data.setAll([
      { value: value1, category: "Hombres" },
      { value: value2, category: "Mujeres" }
    ]);

    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15
    }));

    legend.data.setAll(series.dataItems);
    series.appear(1000, 100);

    /* Añadir chart al array de elementos amchart */
    this.roots.push(root);
  }


  /* Amchart 2: Distribucion de sus publicaciones por territorios */
  private createTerritoryDistributionChart() {
  
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv2");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingLeft: 0
    }));

    // We don't want zoom-out button to appear while animating, so we hide it
    chart.zoomOutButton.set("forceHidden", true);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });

    yRenderer.grid.template.set("location", 1);

    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "category",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, { themeTags: ["axis"] })
    }));

    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      numberFormatter: am5.NumberFormatter.new(root, {
        "numberFormat": "#,###a"
      }),
      extraMax: 0.1,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1,
        minGridDistance: 80

      })
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "category",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "left",
        labelText: "{valueX}"
      })
    }));


    // Rounded corners for columns
    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0
    });

    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    // Crear un nuevo array de datos usando los valores de post_territory
    let data = this.influcard!.post_territory;

    yAxis.data.setAll(data);
    series.data.setAll(data);
    sortCategoryAxis();

    // Get series item by category
    function getSeriesItem(category: string | undefined): any {
      for (var i = 0; i < series.dataItems.length; i++) {
        let dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }

    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      xAxis: xAxis,
      yAxis: yAxis
    }));


    // Axis sorting
    function sortCategoryAxis() {

      // Sort by value
      series.dataItems.sort(function (x, y) {
        return x.get("valueX")! - y.get("valueX")!; // descending
        //return y.get("valueY") - x.get("valueX"); // ascending
      })

      // Go through each axis item
      am5.array.each(yAxis.dataItems, function (dataItem) {
        // get corresponding series item
        let seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          // get index of series data item
          let index = series.dataItems.indexOf(seriesDataItem);
          // calculate delta position
          let deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
          // set index to be the same as series data item index
          dataItem.set("index", index);
          // set deltaPosition instanlty
          dataItem.set("deltaPosition", -deltaPosition);
          // animate delta position to 0
          dataItem.animate({
            key: "deltaPosition",
            to: 0,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
          })
        }
      });

      // Sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set,
      // they keep in the same places and then animate to true positions.
      yAxis.dataItems.sort(function (x, y) {
        return x.get("index")! - y.get("index")!;
      });
    }


    /* (Uso de valores estaticos del JSON, no es necesario esto): */
    // update data with random values each 1.5 sec
    /* setInterval(function () {
      updateData();
    }, 1500) */

    /* function updateData() {
      am5.array.each(series.dataItems, function (dataItem) {
        let value = dataItem.get("valueX")! + Math.round(Math.random() * 1000000000 - 500000000);
        if (value < 0) {
          value = 500000000;
        }
        // both valueY and workingValueY should be changed, we only animate workingValueY
        dataItem.set("valueX", value);
        dataItem.animate({
          key: "valueXWorking",
          to: value,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      })

      sortCategoryAxis();
    } */


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

    /* Añadir chart al array de elementos amchart */
    this.roots.push(root);

  }

  /* Amchart 3: Franja horaria de sus publicaciones */
  private createPostsTimeSlotChart() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv3");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Valores franja horaria en influcard
    let morning = Number(this.influcard!.account_post_moment[0].total);
    let afternoon = Number(this.influcard!.account_post_moment[1].total);
    let night = Number(this.influcard!.account_post_moment[2].total);

    let data = [
      {
        name: "Noche",
        steps: night,
        pictureSettings: {
          src: "https://fontawesome.com/icons/moon?f=classic&s=solid"
        }
      },
      {
        name: "Tarde",
        steps: afternoon,
        pictureSettings: {
          src: "https://fontawesome.com/icons/cloud-sun?f=classic&s=solid"
        }
      },
      {
        name: "Mañana",
        steps: morning,
        pictureSettings: {
          src: "https://fontawesome.com/icons/sun?f=classic&s=solid"
        }
      }
    ];

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft:0,
        paddingRight:30,
        wheelX: "none",
        wheelY: "none"
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    let yRenderer = am5xy.AxisRendererY.new(root, {
      minorGridEnabled:true
    });
    yRenderer.grid.template.set("visible", false);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: yRenderer,
        paddingRight:40
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance:80,
      minorGridEnabled:true
    });

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: xRenderer
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Income",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "steps",
        categoryYField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueX}"
        })
      })
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxHeight: 20,
      fillOpacity: 0.8
    });

    let currentlyHovered: any;

    series.columns.template.events.on("pointerover", function(e) {
      handleHover(e.target.dataItem);
    });

    series.columns.template.events.on("pointerout", function(e) {
      handleOut();
    });

    function handleHover(dataItem: any) {
      if (dataItem && currentlyHovered != dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        let bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }

    function handleOut() {
      if (currentlyHovered) {
        let bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }


    let circleTemplate: any = am5.Template.new({});

    series.bullets.push(function(root, series, dataItem) {
      let bulletContainer = am5.Container.new(root, {});
      let circle = bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 24
          },
          circleTemplate
        )
      );

      let maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 27 })
      );

      // only containers can be masked, so we add image to another container
      let imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle
        })
      );

      // not working
      let image = imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 30,
          height: 30
        })
      );

      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: bulletContainer
      });
    });

    // heatrule
    series.set("heatRules", [
      {
        dataField: "valueX",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: series.columns.template,
        key: "fill"
      },
      {
        dataField: "valueX",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: circleTemplate,
        key: "fill"
      }
    ]);

    series.data.setAll(data);
    yAxis.data.setAll(data);

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    cursor.events.on("cursormoved", function() {
      let dataItem = series.get("tooltip")?.dataItem;
      if (dataItem) {
        handleHover(dataItem)
      }
      else {
        handleOut();
      }
    })

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
    chart.appear(1000, 100);
    
    /* Añadir chart al array de elementos amchart */
    this.roots.push(root);
  }

  /* Amchart 4: Engagement segun dia de publicacion */
  private createEngagementRateChart() {

    let root = am5.Root.new("chartdiv4");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft:0,
      paddingRight:1
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, { 
      minGridDistance: 30, 
      minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    xRenderer.grid.template.setAll({
      location: 1
    })

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "country",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: yRenderer
    }));

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "country",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });


    // Set data
    let data = [{
      country: "L",
      value: 1.2
    }, {
      country: "M",
      value: 1.4
    }, {
      country: "X",
      value: 1.3
    }, {
      country: "J",
      value: 1.6
    }, {
      country: "V",
      value: 1.8
    }, {
      country: "S",
      value: 2
    }, {
      country: "D",
      value: 2.1
    }];

    xAxis.data.setAll(data);
    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

    /* Añadir chart al array de elementos amchart */
    this.roots.push(root);

  }


}

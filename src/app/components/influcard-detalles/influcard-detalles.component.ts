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

        this.createGenderDistributionChart(
          this.influcard.insight_perc_m,
          this.influcard.insight_perc_f
        );

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

  /* Amchart: Distribucion por genero */
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

  /* Amchart: Engagement segun dia de publicacion */
  private createEngagementRateChart() {

    let root = am5.Root.new("chartdiv2");

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

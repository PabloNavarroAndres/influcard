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
  
  private root!: am5.Root;

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
      },
      error: (err) => {

        console.error('Error obteniendo datos de Influcard:', err);
      }
    });

  }

  descargarInflucard(): void {
    /* ... */
  }

   // Run the function only in the browser
   browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {

      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new("chartdiv");


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
      var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      }));


      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      }));


      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      series.data.setAll([
        { value: this.influcard?.insight_perc_m, category: "Hombres" },
        { value: this.influcard?.insight_perc_f, category: "Mujeres" }
      ]);


      // Create legend
      // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
      var legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      }));

      legend.data.setAll(series.dataItems);


      // Play initial series animation
      // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
      series.appear(1000, 100);
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

}

import * as Chart from "chart.js";
import { GRAPH_COLORS } from "../constant";

export default (data) => {
  const { dashboard_report = [] } = data || {};
  dashboard_report.forEach((report) => {
    const { id, data: graphContent } = report || {};
    const { total, critical } = graphContent || {};
    const { dark, light } = GRAPH_COLORS[id] || {};
    const elementId = `myChart-${id}`;
    const ctx = document.getElementById(elementId).getContext("2d");
    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Critical", "Non-Critical"],
        datasets: [
          {
            data: [
              parseFloat(critical),
              parseFloat(total) - parseFloat(critical),
            ],
            backgroundColor: [dark, light],
            borderColor: [dark, light],
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutoutPercentage: 75,
        legend: {
          display: false,
        },
        responsive: true,
      },
    });
  });
};

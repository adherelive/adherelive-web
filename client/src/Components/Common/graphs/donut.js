import React, { Fragment } from "react";

import { Doughnut } from "react-chartjs-2";
import { GRAPH_COLORS, CHART_TITLE } from "../../../constant";
import messages from "./message";

export default function donutGraph(props) {
  const { id, data: graphContent, total, title, formatMessage } = props || {};
  const { dark, light } = GRAPH_COLORS[id] || {};
  const { className } = GRAPH_COLORS[id] || {};
  const labels = [
    formatMessage(messages.compliant_text),
    formatMessage(messages.critical_text),
  ];
  // const labels = [CHART_TITLE[id] === "Adherence" ? formatMessage(messages.compliant_text) : formatMessage(messages.critical_text),
  // CHART_TITLE[id] === "Adherence" ? formatMessage(messages.non_compliant_text) : formatMessage(messages.non_critical_text)
  // ];

  const donutData = {
    labels: labels,
    datasets: [
      {
        // label: label,
        backgroundColor: [dark, light],
        // hoverBackgroundColor: ["#00CDCD", "#4B5000"],
        data: graphContent,
      },
    ],
  };
  const options = {
    cutoutPercentage: 60,
    legend: {
      display: false,
    },
    responsive: true,
  };
  return (
    <Fragment>
      <div className="w205 br5 pb6 flex-shrink-0 mt6 ml6 mr6 chart-box-shadow mb10 mr20 flex direction-column align-center relative">
        <div className="wp100">
          <div className="ml10 mt20 fs16 fw600">{title}</div>
        </div>
        <div className="w130 h130 mt20">
          <Doughnut height={350} data={donutData} options={options} />
        </div>
        <div className="wp90 flex align-center justify-space-between mt20">
          <div className="flex align-center fs10">
            <div
              className={`ml10 mr6 br50 w10 h10 
            ${className["dark"]}`}
            ></div>
            <div>{formatMessage(messages.critical_text)}</div>
          </div>
          <div className="flex align-center fs10">
            <div className={`mr6 br50 w10 h10 ${className["light"]}`}></div>
            <div className="mr10">
              {formatMessage(messages.non_critical_text)}
            </div>
          </div>
        </div>
        <div className="chart-center fs30 fw600">{total}</div>
      </div>
    </Fragment>
  );
}

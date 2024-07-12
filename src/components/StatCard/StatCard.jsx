import classes from "./StatCard.module.scss";
import { ConfigProvider } from "antd";
import { gaugeClasses } from "@mui/x-charts/Gauge";

export default function StatCard({
  label,
  score,
  Icon,
  color,
  unit,
  Progress,
}) {
  let labelClass;
  let progressScore;

  if (typeof score === "number") {
    progressScore = Number(score.toPrecision(4));
    if (!Number.isInteger(score)) {
      score = `${score.toFixed(2)} ${unit}`;
    }
  } else {
    progressScore = 0;
  }
  let arcColor;
  if (progressScore < 40) arcColor = "#ED4D4D";
  if (progressScore >= 40 && progressScore < 60) arcColor = "#EFBF39";
  if (progressScore >= 60) arcColor = "#32E1A0";

  // Determine labelClass based on string value of score
  if (score === "BAD") labelClass = "bad";
  if (score === "OK") labelClass = "ok";
  if (score === "GOOD") labelClass = "good";
  if (score === "EXCELLENT") labelClass = "excellent";

  return (
    <li className={classes.stats}>
      <div className={classes.stats__container}>
        <h1 className={classes.stats__title}>{label}</h1>
        <div
          className={`${classes[labelClass] || ""} ${
            classes.stats__description
          }`}
        >
          {Progress ? (
            <Progress
              width={117}
              height={117}
              value={progressScore}
              startAngle={-110}
              endAngle={110}
              innerRadius="100%"
              style={{
                marginBottom: "-2rem",
                fontSize: "1.8rem",
              }}
              sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: arcColor,
                },
              })}
              className={classes.progress}
              text={({ value }) => `${value}%`}
              outerRadius="120%"
            />
          ) : (
            score
          )}
        </div>
      </div>
      <Icon className={`${classes[`stats__icon_${color}`]}`} />
    </li>
  );
}

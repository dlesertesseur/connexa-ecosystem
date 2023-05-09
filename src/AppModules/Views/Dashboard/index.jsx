import React from "react";
import { Container, Grid } from "@mantine/core";
import { StatRing } from "../../../Components/Stats/StatRing";
import { StatsGrid } from "../../../Components/Stats/StatsGrid";
import { StatsGridIcons } from "../../../Components/Stats/StatsGridIcons";
import { StatSparklines } from "../../../Components/Stats/StatSparklines";
import { StatGraph } from "../../../Components/Stats/StatGraph";


const index = () => {

    function boxMullerRandom() {
        let phase = false,
          x1,
          x2,
          w;
      
        return (function () {
          phase = !phase;
          if (phase) {
            do {
              x1 = 2.0 * Math.random() - 1.0;
              x2 = 2.0 * Math.random() - 1.0;
              w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
      
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            return x1 * w;
          } else {
            return x2 * w;
          }
        })();
      }
      
      function randomData(n = 30) {
        return Array.apply(0, Array(n)).map(boxMullerRandom);
      }

  const stat11 = {label:"Indicador 1", progress:20, color:"#ff0000", stats:100, icon:"discount"};
  const stat12 = {label:"Indicador 2", progress:60, color:"#00ff00", stats:90, icon:"up"};
  const stat13 = {label:"Indicador 3", progress:70, color:"#0000ff", stats:80, icon:"receipt"};
  const stat21 = {title:"Titulo 1", value:1000, diff:100};
  const stat22 = {title:"Titulo 2", value:1000, diff:100};
  const stat31 = {title:"Titulo 1", value:1000, diff:100};
  const stat32 = {title:"Titulo 2", value:1000, diff:100};
  const stat33 = {title:"Titulo 3", value:1000, diff:100};

  const stat41 = {title:"Titulo 1", data:randomData(), color:"#ff0000"};
  const stat42 = {title:"Titulo 2", data:randomData(), color:"#00ff00"};

  const stat51= {
    title:"Titulo 1",
    data: [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]};

  return (
    <Container
      fluid
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
      })}
    >
      <Grid grow>
        <Grid.Col span={4}>
          <StatRing stat={stat11} />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatRing stat={stat12} />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatRing stat={stat13} />
        </Grid.Col>

        <Grid.Col span={6}>
          <StatsGridIcons stat={stat21} />
        </Grid.Col>
        <Grid.Col span={6}>
          <StatsGridIcons stat={stat22} />
        </Grid.Col>

        <Grid.Col span={4}>
          <StatsGrid stat={stat31} />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatsGrid stat={stat32} />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatsGrid stat={stat33} />
        </Grid.Col>

        <Grid.Col span={6}>
          <StatSparklines stat={stat41} />
        </Grid.Col>
        <Grid.Col span={6}>
          <StatSparklines stat={stat42} />
        </Grid.Col>

        <Grid.Col span={12}>
          <StatGraph stat={stat51} />
        </Grid.Col>

      </Grid>
    </Container>
  );
};

export default index;

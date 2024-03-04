import { DollarOutlined } from "@ant-design/icons"
import { Card } from "antd"
import { Text } from "../text"
import { Area, AreaConfig } from "@ant-design/plots"
import React from "react";
import { useList } from "@refinedev/core";
import { mapDealsData } from "@/utilities/helpers";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

const DealsChart = () => {
    const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
        resource: 'dealStages',
        filters: [
            {
                field: 'title', operator: 'in', value: ['WON', 'LOST']
            }
        ],
        meta: {
            gqlQuery: DASHBOARD_DEALS_CHART_QUERY
        }
    });

    const dealData = React.useMemo(() => {
        return mapDealsData(data?.data);
    }, [data?.data])

    const config: AreaConfig = {
        data: dealData,
        xField: 'timeText',
        yField: 'value',
        isStack: false,
        seriesField: 'state',
        animation: true,
        startOnZero: false,
        smooth: true,
        legend: {
            offsetY: -6
        },
        yAxis: {
            tickCount: 4,
            label: {
                formatter: (v: string) => {
                    return `$${Number(v) / 1000}k`
                },
            }
        },
        tooltip: {
            formatter: (data) => {
                return {
                    name: data.state,
                    value: `$${Number(data.value) / 1000}k`
                }
            }
        }
    }
    


  return (
    <Card 
    style = {{height: '100%'}}
    headStyle={{ padding: '8px 16px'}}
    bodyStyle={{ padding: '0 1rem' }}
    title={
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <DollarOutlined />
            <Text size="sm" style={{ marginLeft: "0.5rem"}}>
                Projects
            </Text>
        </div>
    }
    >
        
        <Area {...config} height={325}/>
    </Card>
  )
}

// https://www.npmjs.com/package/@ant-design/plots
export default DealsChart
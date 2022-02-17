import React, { useState, useContext, useEffect, useRef } from 'react'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { AiOutlineConsoleSql, AiOutlineTags } from 'react-icons/ai';
import * as d3 from 'd3';

interface HomeProps {
    joined: firebase.default.firestore.Timestamp,
    businessName: string,
    open: boolean,
    delay: string,
    customerData: firebase.default.firestore.DocumentData[],
    waitingCount: number,
    numOfSubs: number
}

interface DataInterface {
    date: number,
    value: number,
}
export default function Home({ joined, businessName, open, delay, customerData, waitingCount, numOfSubs }: HomeProps) {
    const [total, setTotal] = useState('0');
    const [data, setData] = useState<DataInterface[]>([]);
    const d3Container = useRef<HTMLDivElement>(null);
    const contRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (customerData.length > 0) {
            let tempData = [];
            let money = 0;
            tempData.push({ date: joined.toDate().getTime(), value: 0 })
            customerData.forEach((doc: firebase.default.firestore.DocumentData) => {
                money += parseFloat(doc.amountPaid)
                const item = { date: doc.boughtAt.toDate().getTime(), value: money }
                tempData.push(item)
            })
            tempData.push({ date: (new Date()).getTime(), value: money })
            setTotal(money.toFixed(2))
            setData(tempData)
        }
    }, [customerData])


    useEffect(() => {
        if (data.length > 0) {

            const create = () => {
                const width = contRef.current ? contRef.current.offsetWidth - 100 : 0;
                const height = 300
                const margin = { top: 50, right: 50, bottom: 50, left: 50 };

                d3.select(d3Container.current).select('svg').remove()

                const svg = d3
                    .select(d3Container.current)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);


                const yMinValue = d3.min(data, (d: DataInterface) => d.value);
                const yMaxValue = d3.max(data, (d: DataInterface) => d.value);
                const xMinValue = d3.min(data, (d: DataInterface) => d.date);
                const xMaxValue = d3.max(data, (d: DataInterface) => d.date);

                const xScale = d3
                    .scaleLinear()
                    .domain([xMinValue as number, xMaxValue as number])
                    .range([0, width]);
                const yScale = d3
                    .scaleLinear()
                    .range([height, 0])
                    .domain([yMinValue as number, yMaxValue as number * 1.2]);

                const line = d3
                    .area<DataInterface>()
                    .x((d: DataInterface) => xScale(d.date))
                    .y0(yScale(0))
                    .y1((d: DataInterface) => yScale(d.value))
                    .curve(d3.curveMonotoneX);

                svg
                    .append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(xScale).tickSize(5).ticks(5).tickFormat(d3.timeFormat("%B %d") as (value: Date | { valueOf(): number; }, i: number) => string))

                svg
                    .append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(yScale).tickSize(5));

                interface GradientData {
                    offset: string,
                    color: string
                }[]

                svg.append("linearGradient")
                    .attr("id", "gradient")
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", '0%').attr("y1", '0%')
                    .attr("x2", '0%').attr("y2", '100%')
                    // x1 = 100% (red will be on right horz) / y1 = 100% (red will be on bottom vert)
                    // x2 = 100% (red will be on left horz) / y2 = 100% (red will be on top vert)
                    // mixed values will change the angle of the linear gradient. Adjust as needed.
                    .selectAll("stop")
                    .data([
                        { offset: "0%", color: "#141414" },
                        // add additional steps as needed for gradient.
                        { offset: "65%", color: "transparent" }
                    ])
                    .enter().append("stop")
                    .attr("offset", function (d: GradientData) { return d.offset; })
                    .attr("stop-color", function (d: GradientData) { return d.color; });

                svg
                    .append('path')
                    .datum(data)
                    .attr('fill', 'url(#gradient)')
                    .attr('stroke', '#000')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }

            window.addEventListener('resize', create)
            create()
            return () => {
                window.removeEventListener('resize', create)

            }
        }
    }, [data])

    return (
        <Box>
            <Heading size="lg" mb="10px"> Welcome Back</Heading>
            <Text>{businessName} is currently<b>{!open ? ' closed' : ' open and accepting redemptions'}
                {open && (parseInt(delay) > 0) ? ` with ${delay} min delay` : null}</b></Text>
            <HStack w="full" my="20px" justify="space-between" spacing={12}>
                <HStack align="center" flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{waitingCount}</Text>
                    <Text>Open orders</Text>
                </HStack>
                <HStack flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{numOfSubs}</Text>
                    <Text>Active subscriptions</Text>
                </HStack>

            </HStack>
            <VStack ref={contRef} align="start" borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                <HStack w="full" align="center" p="8" pb="0" >
                    <VStack flex="1" align="start">
                        <Heading fontSize='20'>Revenue</Heading>
                        <Text fontSize='32'>${total}</Text>
                    </VStack>
                    <HStack p={4} spacing={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                        <AiOutlineTags />

                        <Text>All Subscriptions</Text>
                    </HStack>
                </HStack>
                <div ref={d3Container} />
            </VStack>
        </Box>)
}


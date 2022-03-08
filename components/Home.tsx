import React, { useState, useContext, useEffect, useRef, useMemo } from 'react'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { AiOutlineConsoleSql, AiOutlineTags } from 'react-icons/ai';
import * as d3 from 'd3';
import { firestore } from '../lib/firebase';
import { Icon, Select } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';

interface HomeProps {
    joined: firebase.default.firestore.Timestamp,
    businessName: string,
    open: boolean,
    delay: string,
    waitingCount: number,
    numOfSubs: number,
    businessId: string,
    subTitles:string[]
}

interface DataInterface {
    date: number,
    value: number,
}
export default function Home({ joined, businessName, open, delay, waitingCount, numOfSubs, businessId,subTitles }: HomeProps) {
    const [total, setTotal] = useState('0');
    const [data, setData] = useState<DataInterface[]>([]);
    const [range,setRange] = useState('7')
    const [filter, setFilter] = useState("all")
    const d3Container = useRef<HTMLDivElement>(null);
    const contRef = useRef<HTMLDivElement>(null);

    const getPaymentData = async () => {
        const start = range ==='0' ? joined.toDate() : new Date((new Date()).setDate((new Date()).getDate()-parseInt(range)))
        let paymentsQuery = firestore.collection('payments').where('businessId', '==', businessId).where('date','>=',start).orderBy('date');
        if(filter!="all")paymentsQuery = firestore.collection('payments').where('businessId', '==', businessId).where("subscriptionTitle","==",filter).where('date','>=',start).orderBy('date');
        const snapshot = await paymentsQuery.get()
        let money = 0;
        let tempData = []
        //tempData.push({ date: joined.toDate().getTime(), value: 0 })
        snapshot.docs.map((doc, index) => {
            const data = doc.data()
            money += parseFloat(data.amountPaid)
            const item = { date: data.date.toDate().getTime(), value: money }
            tempData.push(item)
        })
        tempData.push({ date: (new Date()).getTime(), value: money })
        setTotal(money.toFixed(2))
        setData(tempData)
    };

    useEffect(() => {
        if (businessId) {
            getPaymentData()
        }
    }, [businessId,filter,range])


    useEffect(() => {
        if (data.length > 0) {

            const create = () => {
                const width = contRef.current ? contRef.current.offsetWidth - 100 : 0;
                const height = 300
                const margin = { top: 50, right: 50, bottom: 50, left: 70 };

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
                    .domain([yMinValue as number *0.8, yMaxValue as number * 1.2]);

                const area = d3
                    .area<DataInterface>()
                    .x((d: DataInterface) => xScale(d.date))
                    .y0(yScale(0))
                    .y1((d: DataInterface) => yScale(d.value))
                    .curve(d3.curveBasis);

                const line = d3.line<DataInterface>()
                    .x((d: DataInterface) => xScale(d.date))
                    .y((d: DataInterface) => yScale(d.value))
                    .curve(d3.curveBasis);

                svg
                    .append('g')
                    .attr('class', 'x-axis')
                    .style('font-size', "14px")
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(xScale).tickSize(20).ticks(3).tickFormat(d3.timeFormat("%B %d") as (value: Date | { valueOf(): number; }, i: number) => string))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").style('stroke', 'none'))

                svg
                    .append('g')
                    .attr('class', 'y-axis')
                    .style('font-size', "14px")
                    .call(d3.axisLeft(yScale).tickSize(20).ticks(5))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").style('stroke', 'none'))

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
                        { offset: "0%", color: "#474747" },
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
                    .attr('d', area);

                svg
                    .append('path')
                    .datum(data)
                    .attr('fill', 'none')
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
                <HStack w="full" align="center" p="8" pb="0" spacing="5">
                    <VStack flex="1" align="start">
                        <Heading fontSize='20'>Revenue</Heading>
                        <Text fontSize='32'>${total}</Text>
                    </VStack>
                    <HStack p={4} spacing={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                        <Select value={filter} onChange={(e)=>setFilter(e.target.value)}>
                            <option value='all'>All Subscriptions</option>
                            {subTitles.map((title,i)=>{
                                return <option key={i} value={title}>{title}</option>
                            })}
                        </Select>
                        <Icon as={AiOutlineTags} w={5} h={5} />
                    </HStack>
                    <HStack p={4} spacing={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)">
                        <Select value={range} onChange={(e)=>setRange(e.target.value)}>
                            <option value='7'>Last 7 days</option>
                            <option value='30'>Last 4 weeks</option>
                            <option value='90'>Last 3 months</option>
                            <option value='365'>Last 12 months</option>
                            <option value='0'>All Time</option>
                        </Select>
                        <Icon as={CalendarIcon} w={5} h={5} />
                    </HStack>
                </HStack>
                <div ref={d3Container} />
            </VStack>
        </Box>)
}


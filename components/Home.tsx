import React, { useState, useContext, useEffect, useRef } from 'react'
import { firestore } from '../lib/firebase';
import { AuthContext } from '../lib/context';
import { Box, Flex, Grid, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/layout'
import { BsArrowRight } from 'react-icons/bs';
import { AiOutlineTags } from 'react-icons/ai';
import { Select } from '@chakra-ui/select';
import * as d3 from 'd3';

export default function Home({ businessName, subscriptions, redemptions, open, delay }: any) {
    const { user,business } = useContext(AuthContext)
    const [waitingCount, setWaitingCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const d3Container = useRef(null);
    const contRef = useRef<any>(null);
    useEffect(() => {
        let temp1 = 0;
        let tempTotal = 0;
        subscriptions.map((sub:any) => {
            tempTotal += sub.purchases * sub.price;
        })
        redemptions.map((r:any) => {
            if (!r.collected) temp1++;
        })
        setWaitingCount(temp1);
        setTotal(tempTotal);

        let unsubscribe;

        if (user && subscriptions.length > 0) {
            const ids = subscriptions.map((sub:any) => sub.id);
            unsubscribe = firestore.collectionGroup('subscribedTo').where('subscriptionId', 'in', ids).orderBy('boughtAt').onSnapshot((snapshot) => {
                let tempData = [];
                let money = 0;
                tempData.push({ date: business?.joined, value: 0 })
                snapshot.forEach((doc) => {
                    money += parseInt(subscriptions.filter((sub:any) => doc.data().subscriptionId == sub.id)[0].price);
                    const item = { date: doc.data().boughtAt.toDate(), value: money }
                    tempData.push(item)
                })
                tempData.push({ date: (new Date()), value: money })
                setData(tempData)
            })
        }

        return unsubscribe;
    }, [subscriptions, redemptions, user, business])


    useEffect(() => {
        if (data.length > 0 && d3Container.current) {

            const create = () =>{
                const width = contRef.current?.offsetWidth - 100
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


                const yMinValue = d3.min(data, (d: any) => d.value);
                const yMaxValue = d3.max(data, (d: any) => d.value);
                const xMinValue = d3.min(data, (d: any) => d.date);
                const xMaxValue = d3.max(data, (d: any) => d.date);

                const xScale = d3
                    .scaleLinear()
                    .domain([xMinValue, xMaxValue])
                    .range([0, width]);
                const yScale = d3
                    .scaleLinear()
                    .range([height, 0])
                    .domain([yMinValue, yMaxValue * 1.2]);

                const line = d3
                    .area()
                    .x((d: any) => xScale(d.date))
                    .y0(yScale(0))
                    .y1((d: any) => yScale(d.value))
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
                    .attr("offset", function (d: any) { return d.offset; })
                    .attr("stop-color", function (d: any) { return d.color; });

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
            <Heading size="lg" mb="10px"> Welcome Back</Heading>{console.log(open)}
            <Text>{businessName} is currently<b>{!open ? ' closed' : ' open and accepting redemptions'}
                {open && (parseInt(delay) > 0) ? ` with ${delay} min delay` : null}</b></Text>
            <HStack w="full" my="20px" justify="space-between" spacing={12}>
                <HStack align="center" flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{waitingCount}</Text>
                    <Text>Open orders</Text>
                </HStack>
                <HStack flex="1" p={8} borderRadius="xl" spacing={12} boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text fontSize='32' as={'b'}>{subscriptions.length}</Text>
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


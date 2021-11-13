import {React,useState,useEffect, useContext} from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import BusinessCheck from '../../components/BusinessCheck';
import { firestore, redToJSON } from '../../lib/firebase';
import { AuthContext } from '../../lib/context';
import { set } from 'react-hook-form';

const drawerWidth = 240;

export default function Dashboard() {

    const [pageState,setPageState] = useState('Main');
    const { user,displayName } = useContext(AuthContext);
    const [subscriptions,setSubscriptions] = useState([]);
    const [redemptions, setRedemptions] = useState([]);

    useEffect(() => {
        // Moved inside "useEffect" to avoid re-creating on render
        const handleRedemptionChanges = (snapshot) => {
            let temp = []
            snapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            
            // Use the setState callback 
            setRedemptions(temp);  
        };
        const handleSubscriptionChanges=(snapshot)=>{
            let temp = []
            snapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            
            // Use the setState callback 
            setSubscriptions(temp);  
        }
        let unsubscribe1;
        let unsubscribe2;
        if(user){
            const subscriptionsQuery = firestore.collection('businesses').doc(user.uid).collection('subscriptions');
            const redemptionsQuery = firestore.collectionGroup('redemptions').where('businessId', '==', user.uid).orderBy('redeemedAt', 'desc').limit(5);
            // Create the DB listener
            unsubscribe1 = redemptionsQuery.onSnapshot(handleRedemptionChanges, 
                err => console.log(err));
            unsubscribe2 = subscriptionsQuery.onSnapshot(handleSubscriptionChanges, 
                err => console.log(err));
        }
        return unsubscribe1,unsubscribe2
    }, [user]);

    return (
        <BusinessCheck>
            <Drawer
            sx={{width: drawerWidth,flexShrink: 0,
                '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
            {['Main', 'Active Sales', 'All Sales', 'Subscriptions'].map((text, index) => (
                <ListItem button key={text} onClick={()=>setPageState(text)}>
                <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {['Store Details', 'Referrals', 'Settings'].map((text, index) => (
                <ListItem button key={text} onClick={()=>setPageState(text)}>
                <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
        </Drawer>
        {pageState === 'Main' ? <Main displayName={displayName} subscriptions={subscriptions}redemptions={redemptions}/> : null}
      </BusinessCheck>

    )
}

function Main({displayName, subscriptions,redemptions}){
    let customerCount = 0;
    subscriptions.map((sub)=>{
        customerCount+=sub.customerCount;
    })
    return(
    <div style={{ marginLeft: '300px' }}>
        {displayName}
        {redemptions.map((redemption)=>{
            return <RedemptionItem key = {redemption.redeemedAt} redemption={redemption}/>
        })}
        Active subscribers: {customerCount}
        , # of subscriptions: {subscriptions.length}
    </div>)
}

function RedemptionItem({redemption}){

    const time = typeof redemption?.redeemedAt === 'number' ? new Date(redemption.redeemedAt) : redemption.redeemedAt.toDate();
    return(
        <div >
            {redemption.redeemedBy} redeemed {redemption.subscriptionName} at {time.toISOString()} 
        </div>
    )
}

function ActiveSales(){
    return(<div></div>)
}

function AllSales(){
    return(<div></div>)
}

function Subscriptions(){
    return(<div></div>)
}
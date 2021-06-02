import React,{useState} from 'react';
import axios from 'axios';
import useStyles from './styles';
import {TextField,Button,CircularProgress,Typography} from '@material-ui/core'
import ScrapedTable from '../ScrapedTable/ScrapedTable';

function Main() {
    const classes = useStyles();
    const[wikiLink,setwikiLink] = useState('');
    const[wikiData, setwikiData] = useState('');
    const[isLoading,setisLoading] = useState(false);
    const[searched,setsearched] = useState(false);
    const[articleHead, setarticleHead] = useState('');
    const[validateURL,setvalidateURL] =useState(true);

    const API = axios.create({baseURL:'http://127.0.0.1:8000/'})
    const handleFormSubmit = async ()=>{
        setvalidateURL(true);
        setsearched(true);
        const ideal = ["https:", "", "en.wikipedia.org", "wiki"];
        const spiltedlink = wikiLink.split('/');
        if(spiltedlink.length>ideal.length+1){
            setvalidateURL(false);
            console.log("oops,not a wiki article link");
            return;
        }
        for (let i = 0; i < ideal.length; i++) {
            if(spiltedlink[i] !== ideal[i]){
                console.log(spiltedlink[i],ideal[i],",oops,not a wiki article link");
                setvalidateURL(false);
                return;
            }
        }        
        try {
            setisLoading(true);
            const {data} = await API.get(`wiki/frequentWords?wikiLink=${wikiLink}`);
            if(data.wrongURL) setvalidateURL(false)
            setwikiData(data.htmlContent);
            setarticleHead(data.heading);
            setisLoading(false);
            
        } catch (error) {
            console.log(error);
        }
       
        
    }
    return (
       
        <div className={classes.container}>
                <div  className={classes.heading}>WIKI-SCRAPPER</div>
                    <form onSubmit={handleFormSubmit}>
                        <TextField  
                            label="Link to the wiki article"
                            variant="outlined" 
                            onChange={(e)=>setwikiLink(e.target.value)}   
                        />
                        <Button className={classes.button} variant="contained" color="primary" onClick={handleFormSubmit}>
                            search
                        </Button>
                    </form> 
                     {
                        validateURL?
                            searched && isLoading?
                            <CircularProgress/>
                            :(<ScrapedTable articleHead={articleHead} wikiData={wikiData}/>)
                        :(
                        <Typography color="secondary" align="center">URL provided is invalid or not a wikipedia article. <br/>Please enter correct wikipedia url (ex:https://en.wikipedia.org/wiki/Page_name)</Typography>
                        )
                    }          
        </div>                       
    
    )
}

export default Main;

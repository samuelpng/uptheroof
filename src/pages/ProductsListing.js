import { Fragment, useContext, useState, useEffect, useLayoutEffect } from "react";
import '../App.css';
import ProductsContext from '../contexts/ProductsContext';
import { Container, Card, Button, Placeholder, Offcanvas, Form, Accordion } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import CardPlaceholder from "../components/CardPlaceholer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import CategoriesContext from "../contexts/CategoriesContext";
import SportsContext from "../contexts/SportsContext";



const options = [
    {
        name: 'Enable body scrolling',
        scroll: true,
        backdrop: false,
    }
]

export default function ProductsListing(props) {

    const [globalSearch, setGlobalSearch] = useState('')
    const [sportSearch, setSportSearch] = useState([])
    const [categorySearch, setCategorySearch] = useState([])

    const [products, setProducts] = useState([])
    // const [sports, setSports] = useState([])
    // const [categories, setCategories] = useState([])

    const [isFetched, setisFetched] = useState(false)

    const { sports, sportsLoading, sportsError } = useContext(SportsContext);
    const { categories, categoriesLoading, categoriesError } = useContext(CategoriesContext);

  
    // const params = useParams()
    const { brand_id } = useParams()

    //show products when page loaded
    useEffect(() => {
        // initialBrandSearch(brand_id)
        search()
    }, [])
    //reset search when state changes 
    useEffect(() => {
        // if( isFetched ){
        //    search();
        // }
        search()
    }, [categorySearch, sportSearch])

    // offCanvasSearch
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const enterSearch = (e) => {
        if (e.key === "Enter") {
            search()
        }
    }

    // const fetchFilters = async () => {
    //     const { data: categories } = await supabase.from("categories").select("*");
    
    //     const { data: sports } = await supabase.from("sports").select("*");
    //     const formattedCategories = categories.map((category) => ({
    //       id: category.id,
    //       name: category.category_name
    //     }))
    //     console.log('categories', categories)
    //     console.log('sports', sports)
    //     setCategories(formattedCategories || []);
    //     setSports(sports || []);
    //   };    

    const updateGlobalSearch = (q) => {
        setGlobalSearch(q)
    }

    // const initialBrandSearch = (brand_id) => {
    //     if(brand_id === "1" || brand_id === "2" || brand_id === "3" ) {
    //         let brand = brandSearch.slice()
    //         brand.push(brand_id)
    //         setBrandSearch(brand)
    //         setisFetched(true)
    //     } else {
    //         setisFetched(true)
    //         search()
    //     }
    // }

    const updateSportSearch = (e) => {
        if (sportSearch.includes(e.target.value)) {
            let clone = sportSearch.slice();
            let indexToRemove = sportSearch.findIndex(i => i === e.target.value);
            clone.splice(indexToRemove, 1);
            setSportSearch(clone)
        } else {
            let clone = sportSearch.slice()
            clone.push(e.target.value)
            setSportSearch(clone)
        }
    }
    const updateCategorySearch = (e) => {
        if (categorySearch.includes(e.target.value)) {
            let clone = categorySearch.slice();
            let indexToRemove = categorySearch.findIndex(i => i === e.target.value);
            clone.splice(indexToRemove, 1);
            setCategorySearch(clone)
        } else {
            let clone = categorySearch.slice()
            clone.push(e.target.value)
            setCategorySearch(clone)
        }
    }

    const clearFilters = () => {
        setCategorySearch([])
        setSportSearch([])
        setGlobalSearch([])
    }

    const search = async () => {
        let query = supabase.from("products").select(`
            id,
            name,
            description,
            sport_id,
            image_url,
            image_url2,
            sports(sport_name),
            products_categories!inner(categories!inner(id, category_name))
        `);
    
        if (globalSearch) {
            query = query.ilike("name", `%${globalSearch}%`); // Case-insensitive search
        }
    
        if (sportSearch.length > 0) {
            query = query.in("sport_id", sportSearch);
        }

        if (categorySearch.length > 0) {
            query = query.in("products_categories.categories.id", categorySearch);
        }
        
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching products:", error);
        } else {
            console.log(data);
            setProducts(data);
        }
    };
    



    if (products) {
        return (
            <Fragment>
                <div className="container">
                 <div>
                        <img src="/images/se-banner.png" style={{width:"100%"}} className="mb-3"></img>
                    </div>
                <Container>
                   
                    <div className="row">
                        <div className="col-lg-9 d-flex">
                            <input id='globalSearch' name='globalSearch' type="text" className='form-control rounded-0 mb-3' style={{ width: "80%" }}
                                value={globalSearch} onChange={(e) => { updateGlobalSearch(e.target.value) }}
                                onKeyUp={(e) => { enterSearch(e) }} />
                            <Button variant="dark rounded-0" onClick={search} className=" mb-3 " style={{ width: "20%" }}> Search
                            </Button>
                        </div>
                        <div className="col-lg-3">
                            <Button variant="dark rounded-0 mb-3" onClick={toggleShow} style={{ width: '100%' }}>
                                Filters
                            </Button>
                        </div>
                    </div>
                    {products ?

                        <ProductCard products={products} />
                        : 
                        
                        <CardPlaceholder />
 
                        }
                        
                    <div style={{ height: "50px" }}></div>
                </Container>

                <Offcanvas show={show} onHide={handleClose} {...props}
                    scroll={true} backdrop={true} placement={'end'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Filter <span className="resetFilters" onClick={clearFilters}>Clear All</span></Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>

                        <Accordion defaultActiveKey="0" className="mt-3" alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Sport {sportSearch.length !== 0 ? <span className="ms-1">({sportSearch.length})</span> : ""}</Accordion.Header>
                                <Accordion.Body>
                                    {sports
                                    ? sports.map((b) => (
                                        <Form.Group className="mb-1" controlId={b.id} key={b.id}>
                                            <Form.Check
                                                type="checkbox"
                                                inline
                                                label={b.sport_name} // Use correct property name
                                                name="sportSearch"
                                                value={b.id}
                                                checked={sportSearch.includes(b.id.toString())}
                                                onChange={updateSportSearch}
                                            />
                                        </Form.Group>
                                    ))
                                    : ""}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Category {categorySearch.length !== 0 ? <span className="ms-1">({categorySearch.length})</span> : ""}</Accordion.Header>
                                <Accordion.Body>
                                    {categories
                                        ? categories.map((b) => (
                                            <Form.Group className="mb-1" controlId={b.id} key={b.id}>
                                                <Form.Check
                                                    type="checkbox"
                                                    inline
                                                    label={b.category_name}
                                                    name="categorySearch"
                                                    value={b.id}
                                                    checked={categorySearch.includes(b.id.toString())}
                                                    onChange={updateCategorySearch}
                                                />
                                            </Form.Group>
                                        ))
                                        : ""}
                                </Accordion.Body>

                            </Accordion.Item>
                        </Accordion>

                    </Offcanvas.Body>
                </Offcanvas>
                </div>
            </Fragment>
        )
    }
}
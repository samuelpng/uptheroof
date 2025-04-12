import { Fragment, useContext, useState, useEffect } from "react";
import '../App.css';
import ProductsContext from '../contexts/ProductsContext';
import { Container, Button, Offcanvas, Form, Accordion } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import CardPlaceholder from "../components/CardPlaceholer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import CategoriesContext from "../contexts/CategoriesContext";
import SportsContext from "../contexts/SportsContext";

export default function ProductsListing() {
    const { sports } = useContext(SportsContext);
    const { categories } = useContext(CategoriesContext);

    const { sportsId, categoryId } = useParams(); // Extract params from URL

    const [globalSearch, setGlobalSearch] = useState('');
    const [sportSearch, setSportSearch] = useState([]);
    const [categorySearch, setCategorySearch] = useState([]);
    const [products, setProducts] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [show, setShow] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);

    useEffect(() => {
        const validSportId = sportsId && sportsId !== "undefined";
        const validCategoryId = categoryId && categoryId !== "undefined";
    
        const initialSportsFilter = validSportId ? [sportsId] : [];
        const initialCategoryFilter = validCategoryId ? [categoryId] : [];
    
        // Set initial state
        setSportSearch(initialSportsFilter);
        setCategorySearch(initialCategoryFilter);
    
        // Immediately search with correct filters
        search(initialSportsFilter, initialCategoryFilter);

        setInitialLoad(true);
    }, [sportsId, categoryId]);
    
    useEffect(() => {
        if (initialLoad) {
            search(sportSearch, categorySearch);
        }
    }, [sportSearch, categorySearch]);

    const search = async (
        sportsFilter = sportSearch,
        categoriesFilter = categorySearch
      ) => {
        let query = supabase
          .from("products")
          .select(`
            id,
            name,
            sport_id,
            image_url,
            sports(sport_name),
            products_categories!inner(
              categories!inner(id, category_name)
            )
          `);
      
        // Global search filter
        if (globalSearch) {
          query = query.ilike("name", `%${globalSearch}%`);
        }
      
        // Sanitize filters
        const cleanSportsFilter = (sportsFilter || []).filter(Boolean);
        const cleanCategoryFilter = (categoriesFilter || []).filter(Boolean);
      
        if (cleanSportsFilter.length > 0) {
          query = query.in("sport_id", cleanSportsFilter);
        }
      
        if (cleanCategoryFilter.length > 0) {
          query = query.in("products_categories.categories.id", cleanCategoryFilter);
        }
      
        const { data, error } = await query;
      
        if (error) {
          console.error("Error fetching products:", error.message, error.details);
        } else {
            console.log('heeloooo')
          setProducts(data);
        }
      };

    const handleToggleFilter = (filterType, value) => {
        setCategorySearch((prev) => filterType === 'category'
            ? prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
            : prev
        );
        setSportSearch((prev) => filterType === 'sport'
            ? prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
            : prev
        );
    };

    return (
        <Fragment>
            <div className="container">
                <div>
                    <img src="/images/se-banner.png" style={{ width: "100%" }} className="mb-3" alt="Banner" />
                </div>
                <Container>
                    <div className="row">
                        <div className="col-lg-9 d-flex">
                            <input
                                type="text"
                                className='form-control rounded-0 mb-3'
                                style={{ width: "80%" }}
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                onKeyUp={(e) => e.key === "Enter" && search()}
                            />
                            <Button variant="dark rounded-0" onClick={search} className="mb-3" style={{ width: "20%" }}>
                                Search
                            </Button>
                        </div>
                        <div className="col-lg-3">
                            <Button variant="dark rounded-0 mb-3" onClick={() => setShow(true)} style={{ width: '100%' }}>
                                Filters
                            </Button>
                        </div>
                    </div>
                    {products.length ? <ProductCard products={products} /> : <CardPlaceholder />}
                </Container>

                {/* Filters Sidebar */}
                <Offcanvas show={show} onHide={() => setShow(false)} placement={'end'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Filters <span className="resetFilters" onClick={() => { setCategorySearch([]); setSportSearch([]); }}>Clear All</span></Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Accordion defaultActiveKey="0" className="mt-3" alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Sport {sportSearch.length ? `(${sportSearch.length})` : ""}</Accordion.Header>
                                <Accordion.Body>
                                    {sports && sports.map((sport) => (
                                        <Form.Group className="mb-1" key={sport.id}>
                                            <Form.Check
                                                type="checkbox"
                                                label={sport.sport_name}
                                                value={sport.id}
                                                checked={sportSearch.includes(sport.id.toString())}
                                                onChange={() => handleToggleFilter("sport", sport.id.toString())}
                                            />
                                        </Form.Group>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Category {categorySearch.length ? `(${categorySearch.length})` : ""}</Accordion.Header>
                                <Accordion.Body>
                                    {categories && categories.map((category) => (
                                        <Form.Group className="mb-1" key={category.id}>
                                            <Form.Check
                                                type="checkbox"
                                                label={category.category_name}
                                                value={category.id}
                                                checked={categorySearch.includes(category.id.toString())}
                                                onChange={() => handleToggleFilter("category", category.id.toString())}
                                            />
                                        </Form.Group>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </Fragment>
    );
}

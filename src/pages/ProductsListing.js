import { Fragment, useContext, useState, useEffect } from "react";
import '../App.css';
import ProductsContext from '../contexts/ProductsContext';
import { Container, Button, Offcanvas, Form, Accordion, Pagination } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import CardPlaceholder from "../components/CardPlaceholer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import CategoriesContext from "../contexts/CategoriesContext";
import SportsContext from "../contexts/SportsContext";

export default function ProductsListing() {
    const { sports } = useContext(SportsContext);
    const { categories } = useContext(CategoriesContext);

    const { sportsId, categoryId } = useParams();

    const [globalSearch, setGlobalSearch] = useState('');
    const [sportSearch, setSportSearch] = useState([]);
    const [categorySearch, setCategorySearch] = useState([]);
    const [products, setProducts] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [show, setShow] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const validSportId = sportsId && sportsId !== "undefined";
        const validCategoryId = categoryId && categoryId !== "undefined";

        const initialSportsFilter = validSportId ? [sportsId] : [];
        const initialCategoryFilter = validCategoryId ? [categoryId] : [];

        setSportSearch(initialSportsFilter);
        setCategorySearch(initialCategoryFilter);

        search(initialSportsFilter, initialCategoryFilter, 1);
        setCurrentPage(1);
        setInitialLoad(true);
    }, [sportsId, categoryId]);

    useEffect(() => {
        if (initialLoad) {
            search(sportSearch, categorySearch, currentPage);
        }
    }, [sportSearch, categorySearch]);

    useEffect(() => {
        if (initialLoad) {
            search(sportSearch, categorySearch, currentPage);
        }
    }, [currentPage]);

    const search = async (
        sportsFilter = sportSearch,
        categoriesFilter = categorySearch,
        page = currentPage
    ) => {
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

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
            `, { count: "exact" })
            .range(from, to);

        if (globalSearch) {
            query = query.ilike("name", `%${globalSearch}%`);
        }

        const cleanSportsFilter = (sportsFilter || []).filter(Boolean);
        const cleanCategoryFilter = (categoriesFilter || []).filter(Boolean);

        if (cleanSportsFilter.length > 0) {
            query = query.in("sport_id", cleanSportsFilter);
        }

        if (cleanCategoryFilter.length > 0) {
            query = query.in("products_categories.categories.id", cleanCategoryFilter);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error("Error fetching products:", error.message, error.details);
        } else {
            setProducts(data);
            setTotalCount(count);
        }
    };

    const handleToggleFilter = (filterType, value) => {
        if (filterType === 'category') {
            setCategorySearch(prev =>
                prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
            );
        }
        if (filterType === 'sport') {
            setSportSearch(prev =>
                prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
            );
        }
        setCurrentPage(1); // Reset to first page on filter change
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        if (totalPages <= 1) return null;

        return (
            <Pagination className="justify-content-center mt-4">
                <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
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
                            <Button variant="dark rounded-0" onClick={() => { setCurrentPage(1); search(); }} className="mb-3" style={{ width: "20%" }}>
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
                    {renderPagination()}
                </Container>

                {/* Filters Sidebar */}
                <Offcanvas show={show} onHide={() => setShow(false)} placement={'end'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            Filters <span className="resetFilters" onClick={() => {
                                setCategorySearch([]);
                                setSportSearch([]);
                                setCurrentPage(1);
                            }}>Clear All</span>
                        </Offcanvas.Title>
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

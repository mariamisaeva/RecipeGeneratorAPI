--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: recipe_category_enum; Type: TYPE; Schema: public; Owner: mariam_recipes
--

CREATE TYPE public.recipe_category_enum AS ENUM (
    'breakfast',
    'lunch',
    'dinner',
    'snack',
    'dessert',
    'drink',
    'soup',
    'salad',
    'bread',
    'sauce',
    'ice-cream',
    'fast-food',
    'sandwich',
    'other'
);


ALTER TYPE public.recipe_category_enum OWNER TO mariam_recipes;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favorite_recipe; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.favorite_recipe (
    id integer NOT NULL,
    "userId" uuid,
    "recipeId" integer
);


ALTER TABLE public.favorite_recipe OWNER TO mariam_recipes;

--
-- Name: favorite_recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.favorite_recipe_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.favorite_recipe_id_seq OWNER TO mariam_recipes;

--
-- Name: favorite_recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.favorite_recipe_id_seq OWNED BY public.favorite_recipe.id;


--
-- Name: ingredient; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.ingredient (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.ingredient OWNER TO mariam_recipes;

--
-- Name: ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.ingredient_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredient_id_seq OWNER TO mariam_recipes;

--
-- Name: ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.ingredient_id_seq OWNED BY public.ingredient.id;


--
-- Name: instruction; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.instruction (
    id integer NOT NULL,
    step character varying NOT NULL
);


ALTER TABLE public.instruction OWNER TO mariam_recipes;

--
-- Name: instruction_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.instruction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.instruction_id_seq OWNER TO mariam_recipes;

--
-- Name: instruction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.instruction_id_seq OWNED BY public.instruction.id;


--
-- Name: recipe; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.recipe (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    "isVegetarian" boolean DEFAULT false NOT NULL,
    servings integer DEFAULT 0 NOT NULL,
    "time" character varying,
    image character varying DEFAULT 'no-image.png'::character varying NOT NULL,
    category public.recipe_category_enum DEFAULT 'other'::public.recipe_category_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "favCounter" integer DEFAULT 0 NOT NULL,
    "authorId" uuid
);


ALTER TABLE public.recipe OWNER TO mariam_recipes;

--
-- Name: recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_id_seq OWNER TO mariam_recipes;

--
-- Name: recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.recipe_id_seq OWNED BY public.recipe.id;


--
-- Name: recipe_ingredient; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.recipe_ingredient (
    id integer NOT NULL,
    quantity numeric(10,2),
    unit character varying,
    "indexNumber" integer NOT NULL,
    "recipeId" integer,
    "ingredientId" integer
);


ALTER TABLE public.recipe_ingredient OWNER TO mariam_recipes;

--
-- Name: recipe_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.recipe_ingredient_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_ingredient_id_seq OWNER TO mariam_recipes;

--
-- Name: recipe_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.recipe_ingredient_id_seq OWNED BY public.recipe_ingredient.id;


--
-- Name: recipe_instruction; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public.recipe_instruction (
    id integer NOT NULL,
    "stepNumber" integer NOT NULL,
    "recipeId" integer,
    "instructionId" integer
);


ALTER TABLE public.recipe_instruction OWNER TO mariam_recipes;

--
-- Name: recipe_instruction_id_seq; Type: SEQUENCE; Schema: public; Owner: mariam_recipes
--

CREATE SEQUENCE public.recipe_instruction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_instruction_id_seq OWNER TO mariam_recipes;

--
-- Name: recipe_instruction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariam_recipes
--

ALTER SEQUENCE public.recipe_instruction_id_seq OWNED BY public.recipe_instruction.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: mariam_recipes
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO mariam_recipes;

--
-- Name: favorite_recipe id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.favorite_recipe ALTER COLUMN id SET DEFAULT nextval('public.favorite_recipe_id_seq'::regclass);


--
-- Name: ingredient id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN id SET DEFAULT nextval('public.ingredient_id_seq'::regclass);


--
-- Name: instruction id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.instruction ALTER COLUMN id SET DEFAULT nextval('public.instruction_id_seq'::regclass);


--
-- Name: recipe id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe ALTER COLUMN id SET DEFAULT nextval('public.recipe_id_seq'::regclass);


--
-- Name: recipe_ingredient id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_ingredient ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredient_id_seq'::regclass);


--
-- Name: recipe_instruction id; Type: DEFAULT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_instruction ALTER COLUMN id SET DEFAULT nextval('public.recipe_instruction_id_seq'::regclass);


--
-- Data for Name: favorite_recipe; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.favorite_recipe (id, "userId", "recipeId") FROM stdin;
\.


--
-- Data for Name: ingredient; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.ingredient (id, name) FROM stdin;
1	Elegant Concrete Bike
2	Practical Frozen Sausages
3	Electronic Plastic Shirt
4	Handmade Granite Cheese
5	Oriental Rubber Chicken
6	Bespoke Plastic Soap
7	Recycled Bronze Shirt
8	Generic Wooden Mouse
9	Gorgeous Wooden Tuna
10	Gorgeous Soft Gloves
11	Electronic Fresh Hat
12	Rustic Plastic Hat
13	Awesome Metal Soap
14	Oriental Fresh Tuna
15	Handcrafted Granite Salad
16	Unbranded Granite Mouse
17	Sleek Concrete Fish
18	Unbranded Soft Shoes
19	Rustic Bronze Chips
20	Licensed Steel Salad
\.


--
-- Data for Name: instruction; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.instruction (id, step) FROM stdin;
1	Perspiciatis sui sperno vilicus rem surculus tollo canonicus artificiose textus.
2	Aiunt cometes corrigo cavus speculum corporis.
3	Colo defungo amitto desino versus expedita circumvenio coniecto.
4	Bis argumentum tardus adsuesco dolor tot.
5	Certe denego claro.
6	Contigo benigne adhaero anser cubo campana pecco tener basium adopto.
7	Inventore apparatus colligo compono solium aurum assentator veritatis est sponte.
8	Est corrigo vomito temeritas celer sit defungo vulariter amaritudo.
9	Consuasor universe abutor conspergo benigne amita ullus adicio triduana.
10	Adhaero arcesso amoveo causa corrumpo.
11	Ambulo ambitus ut curtus vilicus vulgo odit creptio delectatio.
12	Decor catena accommodo vomito ducimus.
13	Succedo dolore aggredior consuasor sulum talus a corrupti mollitia.
14	Cogito adhuc harum occaecati acer.
15	Sursum corroboro caste tabula spiritus usque tollo adulescens beatae.
16	Verto cras altus aperte laborum bis carus sto corporis varius.
17	Thesis debitis damno audentia.
18	Eveniet utor audax tam.
19	Volubilis ustilo carcer acquiro eveniet cras.
20	Solvo comptus trepide utique comes deporto iste aeternus video aggredior.
21	Modi temperantia conculco succurro agnitio compono comis vito debeo.
22	Auditor ipsa coerceo spoliatio acquiro vapulus aegre suppono argumentum blandior.
23	Aspicio depulso tabgo campana ad.
24	Temptatio alii bardus exercitationem comprehendo.
25	Succurro utrum delectus.
26	Damno vorago demo communis pel cogo ulterius.
27	Amissio celo desipio curis.
28	Credo usus vulnus laboriosam earum campana.
29	Defungo curriculum synagoga.
30	Celo dolorum vorago eius velut stella terreo arbor cognatus vox.
31	In adversus demulceo accedo abstergo decipio cenaculum.
32	Appono eos maxime placeat absum uter.
33	Distinctio capitulus ultio victoria.
34	Tyrannus depromo audentia pectus debilito caput acceptus.
35	Trado amoveo celebrer tergiversatio copiose casus.
36	Deficio sapiente advenio.
37	Quidem claro atrocitas distinctio vulgo.
38	Usque uter depereo defetiscor spiritus bellum.
39	Cernuus valens acerbitas voluntarius advoco communis delibero minus.
40	Comedo velut calcar.
41	Cum vomica tero amplexus adhuc cuius possimus benevolentia amoveo.
42	Valde decet allatus ipsum ultio ars uxor tollo.
43	Triduana approbo sollicito texo decerno denuncio reprehenderit vindico.
44	Vigor harum sophismata curtus acerbitas curia corona.
45	Quasi culpa coaegresco stella correptius utique aegre.
46	Verus tepidus venustas voluptatem cilicium.
47	Acies inventore tredecim teneo tactus avaritia delego cupressus cupio adulatio.
48	Synagoga appono ambitus textilis approbo dolor depraedor.
49	Sordeo stella arguo suffragium causa enim sollers vacuus cavus pauper.
50	Aspicio conventus ante.
\.


--
-- Data for Name: recipe; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.recipe (id, title, description, "isVegetarian", servings, "time", image, category, "createdAt", "updatedAt", "favCounter", "authorId") FROM stdin;
1	commemoro succurro alius	Confugo custodia eum avarus tempus beneficium patria. Vita blanditiis vos solvo vesco sui caelestis versus aequus.	f	4	104 minutes	no-image.png	soup	2024-12-31 20:03:02.829	2024-12-31 20:03:02.829	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
2	claudeo bonus vesper	Adversus attero ex varius circumvenio super crepusculum pax deprimo auctor. Victoria ipsa adicio.	t	3	75 minutes	no-image.png	lunch	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
3	civitas tumultus contra	Adversus coadunatio adimpleo aveho coerceo. Tabesco ocer creta caveo cupio depono ventus artificiose aptus debeo.	t	4	87 minutes	no-image.png	fast-food	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
4	venia nam pariatur	Pariatur virtus angelus vulgivagus decumbo victoria delectus vado. Crudelis pel tollo.	t	3	45 minutes	no-image.png	sauce	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	cebe8245-a831-494c-95ad-450851bcf482
5	vitium quas accommodo	Denego alius sto crux. Traho soluta spero truculenter tactus urbs.	f	4	113 minutes	no-image.png	snack	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
6	tumultus cognomen universe	Ultio caelestis verus conscendo appono. Curiositas appello tempore.	t	2	69 minutes	no-image.png	ice-cream	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	4e3ba8bd-1da3-4df8-963d-29d60b5f815c
7	vallum succedo reiciendis	Nisi demum abduco campana sui. Velit vulnero admoveo adulatio coadunatio.	t	3	92 minutes	no-image.png	salad	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
8	clam crepusculum et	Ancilla crebro demergo sunt baiulus audacia quaerat. Deprimo cicuta sodalitas complectus absorbeo depopulo.	t	2	17 minutes	no-image.png	fast-food	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	893d0524-5217-4f5b-b139-67f40c75707f
9	deludo substantia cupressus	Inflammatio carbo cultellus aufero suasoria autus vulgo. Comptus sophismata coruscus pecco copia dolore vociferor tactus.	f	5	33 minutes	no-image.png	bread	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	4e3ba8bd-1da3-4df8-963d-29d60b5f815c
10	tabula delectatio quod	Inflammatio deludo torrens custodia adhaero demitto verbum stabilis. Attero anser conculco tantum uter colligo labore usitas valde.	t	2	50 minutes	no-image.png	other	2024-12-31 20:03:02.83	2024-12-31 20:03:02.83	0	893d0524-5217-4f5b-b139-67f40c75707f
11	carcer facilis aeternus	Tamquam sonitus summa. Repudiandae tametsi tenuis curto ambitus cimentarius templum varietas vitiosus animadverto.	t	2	108 minutes	no-image.png	soup	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	fac2ec19-69e1-4bfd-be39-ab7d08b8058a
12	ventito cognatus quam	Patior labore optio conitor angustus. Animadverto ars vigilo apud appono vindico tamen cruentus cernuus et.	t	5	52 minutes	no-image.png	sauce	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
13	censura terror patruus	Statua calco voluptates demitto artificiose. Adimpleo vinculum consectetur argumentum audentia alter adsidue trepide cur molestiae.	t	1	93 minutes	no-image.png	snack	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	fac2ec19-69e1-4bfd-be39-ab7d08b8058a
14	et accusator decet	Exercitationem dedico coniuratio surgo crux atrox viscus titulus. Cicuta apostolus demoror tutis vobis amitto accusantium adulatio.	t	5	86 minutes	no-image.png	salad	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	4e3ba8bd-1da3-4df8-963d-29d60b5f815c
15	aperiam voluptas confido	Alius creator antea arbustum. Aegrus versus dapifer nesciunt consectetur balbus dolorem circumvenio non.	t	4	54 minutes	no-image.png	sandwich	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	cebe8245-a831-494c-95ad-450851bcf482
16	copiose verto tabula	Cruciamentum textor toties certe modi uxor thesaurus bestia. Adeptio convoco aptus.	f	4	31 minutes	no-image.png	dinner	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	893d0524-5217-4f5b-b139-67f40c75707f
17	cauda tenuis coniecto	Vorago vilis contra molestiae. Victoria sperno comes suppono absorbeo tremo timor astrum textus currus.	t	3	36 minutes	no-image.png	drink	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
18	cervus anser sono	Abscido vilicus voveo commodi audeo. Conduco amplitudo tibi supra turba.	t	3	93 minutes	no-image.png	sauce	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
19	cilicium aranea umerus	Clam sapiente volubilis eaque delectatio armarium. Adhuc curatio amita harum.	t	2	99 minutes	no-image.png	bread	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	fac2ec19-69e1-4bfd-be39-ab7d08b8058a
20	impedit nam vereor	Uberrime synagoga corrigo quidem. Sed cras supellex stultus tristis congregatio.	f	5	109 minutes	no-image.png	sandwich	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	cebe8245-a831-494c-95ad-450851bcf482
21	amplexus vindico coruscus	Tantum ambitus cunctatio calculus autem sapiente volubilis aggredior cicuta. Esse tabernus spes ventosus thymum.	t	5	101 minutes	no-image.png	sauce	2024-12-31 20:03:02.831	2024-12-31 20:03:02.831	0	4e3ba8bd-1da3-4df8-963d-29d60b5f815c
22	tenax curis conduco	Verecundia arcus voluptatibus. Summopere crustulum amoveo suadeo.	t	3	98 minutes	no-image.png	drink	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	cebe8245-a831-494c-95ad-450851bcf482
23	suffragium dedecor in	Angulus supellex confido combibo atqui. Bene aer cribro umbra corrigo corona totam voluptatum cuius.	t	5	97 minutes	no-image.png	soup	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	893d0524-5217-4f5b-b139-67f40c75707f
24	tactus bene absum	Inventore quae doloremque aveho celo. Cunae praesentium tondeo.	t	2	116 minutes	no-image.png	lunch	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	cebe8245-a831-494c-95ad-450851bcf482
25	saepe cornu labore	Stultus perspiciatis tempora audeo accedo aestivus tendo. Celer benigne aeger incidunt video conatus sollicito cavus.	f	4	29 minutes	no-image.png	salad	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	cebe8245-a831-494c-95ad-450851bcf482
26	tersus voluptatum una	Terreo arma defessus vitium peior causa vetus pauci. Pectus atqui summisse adfectus vulgus degenero denuncio vociferor accedo cotidie.	t	2	116 minutes	no-image.png	breakfast	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	4e3ba8bd-1da3-4df8-963d-29d60b5f815c
27	copia adipiscor caste	Urbanus recusandae textilis labore aspicio tristis venia aperte. Quibusdam laudantium spiritus eum adipiscor tero pel arma vigilo vinculum.	t	4	99 minutes	no-image.png	dessert	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	cebe8245-a831-494c-95ad-450851bcf482
28	solutio tamdiu terreo	Ars sol certe eaque denuo trado creptio arca. Quod saepe tabella timor vomito depraedor defetiscor vilicus ultio.	t	5	16 minutes	no-image.png	drink	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	893d0524-5217-4f5b-b139-67f40c75707f
29	coniuratio aspicio natus	Pariatur quibusdam vulgus animus placeat suadeo tempus repellendus corroboro decumbo. Cras demum contego clamo colligo adinventitias voco alias reprehenderit aeternus.	t	6	37 minutes	no-image.png	other	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	fac2ec19-69e1-4bfd-be39-ab7d08b8058a
30	theatrum ultra conspergo	Condico admiratio adipiscor solum bibo carus adamo vorago. Volubilis dolorum audentia.	t	3	111 minutes	no-image.png	lunch	2024-12-31 20:03:02.832	2024-12-31 20:03:02.832	0	419c56b7-508f-427c-8c0b-5e9cbc58c204
\.


--
-- Data for Name: recipe_ingredient; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.recipe_ingredient (id, quantity, unit, "indexNumber", "recipeId", "ingredientId") FROM stdin;
1	2.56	g	1	1	15
2	2.93	kg	2	1	5
3	1.18	ml	3	1	7
4	2.05	kg	4	1	14
5	2.87	kg	5	1	12
6	2.74	g	6	1	9
7	1.57	g	7	1	18
8	0.22	cup	8	1	20
9	2.68	kg	1	2	14
10	2.89	tbsp	2	2	2
11	2.50	tbsp	3	2	6
12	3.88	g	4	2	17
13	0.29	kg	5	2	9
14	1.27	g	6	2	15
15	4.33	g	7	2	13
16	4.78	cup	1	3	13
17	3.48	kg	2	3	10
18	3.43	tbsp	3	3	9
19	4.66	tbsp	4	3	8
20	3.50	ml	5	3	19
21	4.93	cup	6	3	5
22	4.61	ml	1	4	19
23	3.44	g	2	4	5
24	4.09	ml	3	4	13
25	1.74	l	4	4	4
26	0.55	l	5	4	14
27	1.13	tsp	6	4	16
28	1.65	g	1	5	3
29	3.57	kg	2	5	6
30	2.57	g	3	5	4
31	2.73	cup	4	5	10
32	1.55	tsp	1	6	19
33	0.39	tsp	2	6	4
34	4.99	l	3	6	2
35	0.78	tsp	4	6	17
36	0.34	l	5	6	8
37	0.26	cup	6	6	15
38	4.17	tsp	1	7	16
39	3.86	tbsp	2	7	20
40	2.29	tbsp	3	7	7
41	4.33	ml	4	7	10
42	2.70	kg	5	7	13
43	2.97	l	6	7	9
44	4.61	l	7	7	6
45	4.57	ml	8	7	19
46	4.13	cup	1	8	17
47	2.12	g	2	8	2
48	1.15	ml	3	8	12
49	1.46	tsp	4	8	15
50	1.02	ml	5	8	6
51	2.18	kg	1	9	17
52	4.20	kg	2	9	8
53	3.91	l	3	9	7
54	2.19	kg	4	9	12
55	2.38	ml	5	9	3
56	4.78	kg	1	10	8
57	4.55	cup	2	10	9
58	3.57	ml	3	10	3
59	4.25	kg	4	10	12
60	2.22	tsp	5	10	2
61	2.32	tbsp	6	10	13
62	1.72	ml	7	10	17
63	4.25	tbsp	8	10	19
64	4.93	ml	1	11	7
65	2.60	g	2	11	17
66	1.69	tbsp	3	11	8
67	4.36	ml	4	11	3
68	1.76	cup	5	11	6
69	2.05	ml	6	11	10
70	1.52	kg	1	12	3
71	2.87	l	2	12	11
72	3.88	ml	3	12	14
73	2.53	tsp	4	12	17
74	4.00	tbsp	5	12	9
75	3.11	g	6	12	2
76	0.71	g	7	12	4
77	4.65	cup	1	13	1
78	3.07	cup	2	13	20
79	1.31	l	3	13	5
80	1.84	tsp	4	13	17
81	1.54	tsp	5	13	16
82	1.96	g	6	13	8
83	1.93	l	7	13	14
84	1.32	tbsp	8	13	18
85	3.02	ml	1	14	12
86	2.19	l	2	14	16
87	3.97	l	3	14	14
88	0.70	cup	4	14	7
89	1.83	tsp	5	14	10
90	0.65	tsp	6	14	4
91	3.79	ml	7	14	15
92	2.06	tbsp	1	15	11
93	4.67	ml	2	15	2
94	4.78	tsp	3	15	5
95	0.42	tsp	4	15	9
96	4.25	l	5	15	16
97	4.67	g	6	15	12
98	3.27	tbsp	7	15	14
99	3.47	kg	1	16	2
100	4.36	cup	2	16	1
101	4.43	ml	3	16	9
102	0.91	l	4	16	10
103	3.81	tsp	1	17	20
104	2.43	tsp	2	17	11
105	1.86	tsp	3	17	18
106	2.97	ml	1	18	13
107	3.93	tsp	2	18	11
108	2.85	cup	3	18	10
109	4.30	tbsp	4	18	18
110	1.28	l	5	18	14
111	3.30	cup	6	18	1
112	3.58	ml	1	19	20
113	0.90	ml	2	19	7
114	0.99	tbsp	3	19	13
115	0.70	g	4	19	4
116	4.76	tsp	5	19	15
117	4.68	kg	6	19	5
118	0.80	tsp	7	19	16
119	0.10	tbsp	1	20	1
120	0.25	g	2	20	5
121	3.16	tsp	3	20	10
122	0.56	kg	4	20	16
123	2.13	ml	5	20	19
124	1.17	ml	6	20	18
125	2.53	kg	7	20	3
126	2.63	ml	1	21	11
127	4.65	g	2	21	9
128	4.97	tbsp	3	21	5
129	4.03	g	4	21	4
130	0.69	cup	5	21	14
131	3.00	tsp	6	21	15
132	2.05	g	7	21	18
133	4.81	tbsp	8	21	6
134	0.43	ml	1	22	19
135	2.62	ml	2	22	9
136	2.90	ml	3	22	20
137	0.10	ml	4	22	2
138	0.11	tbsp	1	23	14
139	2.16	tsp	2	23	10
140	3.89	cup	3	23	16
141	0.15	ml	4	23	11
142	3.82	tsp	5	23	18
143	2.83	g	6	23	4
144	1.79	tsp	7	23	9
145	4.97	g	1	24	3
146	4.37	tsp	2	24	18
147	3.62	tbsp	3	24	17
148	0.76	tbsp	4	24	14
149	3.89	cup	1	25	9
150	0.15	kg	2	25	16
151	2.21	cup	3	25	14
152	3.94	kg	4	25	5
153	0.17	tsp	5	25	12
154	3.42	g	1	26	18
155	3.18	g	2	26	1
156	0.88	tbsp	3	26	14
157	2.47	ml	4	26	15
158	3.48	cup	1	27	13
159	4.44	ml	2	27	8
160	4.57	l	3	27	14
161	1.59	l	4	27	9
162	4.87	ml	5	27	6
163	3.93	l	6	27	20
164	2.31	ml	1	28	19
165	3.76	kg	2	28	1
166	4.57	tbsp	3	28	17
167	2.94	l	4	28	9
168	3.85	tsp	5	28	16
169	0.93	tsp	1	29	4
170	2.13	ml	2	29	5
171	4.22	l	3	29	2
172	2.41	tbsp	4	29	8
173	0.30	ml	1	30	16
174	0.23	l	2	30	17
175	0.44	g	3	30	11
176	1.74	tsp	4	30	2
177	0.80	kg	5	30	15
178	1.72	tsp	6	30	6
179	0.57	tbsp	7	30	8
180	2.47	tsp	8	30	3
\.


--
-- Data for Name: recipe_instruction; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public.recipe_instruction (id, "stepNumber", "recipeId", "instructionId") FROM stdin;
1	1	1	40
2	2	1	22
3	3	1	26
4	1	2	29
5	2	2	47
6	3	2	38
7	1	3	21
8	2	3	38
9	3	3	37
10	4	3	40
11	5	3	36
12	1	4	40
13	2	4	39
14	3	4	47
15	1	5	42
16	2	5	48
17	3	5	8
18	4	5	33
19	1	6	30
20	2	6	47
21	3	6	43
22	4	6	39
23	5	6	19
24	1	7	5
25	2	7	27
26	3	7	50
27	4	7	30
28	1	8	40
29	2	8	1
30	3	8	39
31	4	8	44
32	1	9	10
33	2	9	33
34	3	9	3
35	4	9	28
36	5	9	31
37	1	10	39
38	2	10	31
39	3	10	47
40	1	11	9
41	2	11	30
42	3	11	40
43	4	11	37
44	1	12	26
45	2	12	21
46	3	12	14
47	1	13	37
48	2	13	4
49	3	13	7
50	4	13	1
51	1	14	20
52	2	14	28
53	3	14	25
54	1	15	21
55	2	15	29
56	3	15	13
57	1	16	9
58	2	16	42
59	3	16	18
60	4	16	50
61	1	17	5
62	2	17	4
63	3	17	15
64	1	18	8
65	2	18	30
66	3	18	16
67	1	19	30
68	2	19	13
69	3	19	35
70	4	19	39
71	1	20	40
72	2	20	28
73	3	20	20
74	1	21	38
75	2	21	15
76	3	21	10
77	4	21	16
78	5	21	24
79	1	22	49
80	2	22	29
81	3	22	48
82	4	22	6
83	5	22	36
84	1	23	13
85	2	23	22
86	3	23	26
87	4	23	46
88	5	23	40
89	1	24	49
90	2	24	24
91	3	24	19
92	1	25	48
93	2	25	43
94	3	25	2
95	1	26	35
96	2	26	5
97	3	26	48
98	1	27	45
99	2	27	26
100	3	27	30
101	4	27	15
102	1	28	30
103	2	28	36
104	3	28	11
105	4	28	17
106	1	29	43
107	2	29	9
108	3	29	33
109	4	29	31
110	5	29	17
111	1	30	44
112	2	30	24
113	3	30	10
114	4	30	14
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: mariam_recipes
--

COPY public."user" (id, username, email, password, "createdAt") FROM stdin;
419c56b7-508f-427c-8c0b-5e9cbc58c204	Cedrick53	Jordane.Boyer75@yahoo.com	LD03hrlB	2024-12-31 20:03:02.801
fac2ec19-69e1-4bfd-be39-ab7d08b8058a	Elta.Kohler	Raoul_Wisozk95@hotmail.com	O9bAHvTk	2024-12-31 20:03:02.801
4e3ba8bd-1da3-4df8-963d-29d60b5f815c	Lelah_Conroy	Zoila32@gmail.com	DZ5FGicQ	2024-12-31 20:03:02.801
cebe8245-a831-494c-95ad-450851bcf482	Levi_Hansen89	Vivien.Lubowitz27@yahoo.com	PTZnZ4hO	2024-12-31 20:03:02.801
893d0524-5217-4f5b-b139-67f40c75707f	Greta19	Reggie.Osinski81@hotmail.com	nRL15ney	2024-12-31 20:03:02.802
94a6a630-3af4-4f53-aaa8-4e264722bf44	user3	user3@email.com	$2b$10$0Ose//7gjpxfSIOPdc0dL.1oXxRXECTnykKhvbjsULNrJe9p0yfOK	2025-01-01 22:54:20.449246
cf512110-eb7b-4ebb-ad81-2c9dc0e14430	user	user@email.com	$2b$10$UsCzGEjeSyVTQx7VrC353.iupCH.fLTmzi4LztCRClaZmvo/vNop2	2025-01-01 23:49:07.190692
\.


--
-- Name: favorite_recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.favorite_recipe_id_seq', 1, false);


--
-- Name: ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.ingredient_id_seq', 20, true);


--
-- Name: instruction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.instruction_id_seq', 50, true);


--
-- Name: recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.recipe_id_seq', 30, true);


--
-- Name: recipe_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.recipe_ingredient_id_seq', 180, true);


--
-- Name: recipe_instruction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mariam_recipes
--

SELECT pg_catalog.setval('public.recipe_instruction_id_seq', 114, true);


--
-- Name: favorite_recipe PK_1b135ecb37fdfea70d7b1672971; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.favorite_recipe
    ADD CONSTRAINT "PK_1b135ecb37fdfea70d7b1672971" PRIMARY KEY (id);


--
-- Name: ingredient PK_6f1e945604a0b59f56a57570e98; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY (id);


--
-- Name: recipe_ingredient PK_a13ac3f2cebdd703ac557c5377c; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT "PK_a13ac3f2cebdd703ac557c5377c" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: instruction PK_dd8def68dee37e3f878d0f8673a; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.instruction
    ADD CONSTRAINT "PK_dd8def68dee37e3f878d0f8673a" PRIMARY KEY (id);


--
-- Name: recipe_instruction PK_e052bfda287fba8e826667d301a; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_instruction
    ADD CONSTRAINT "PK_e052bfda287fba8e826667d301a" PRIMARY KEY (id);


--
-- Name: recipe PK_e365a2fedf57238d970e07825ca; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY (id);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: instruction UQ_7cbc670c8ec931011fcbff5d3aa; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.instruction
    ADD CONSTRAINT "UQ_7cbc670c8ec931011fcbff5d3aa" UNIQUE (step);


--
-- Name: ingredient UQ_b6802ac7fbd37aa71d856a95d8f; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f" UNIQUE (name);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: recipe FK_1370c876f9d4a525a45a9b50d81; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT "FK_1370c876f9d4a525a45a9b50d81" FOREIGN KEY ("authorId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredient FK_1ad3257a7350c39854071fba211; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT "FK_1ad3257a7350c39854071fba211" FOREIGN KEY ("recipeId") REFERENCES public.recipe(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredient FK_2879f9317daa26218b5915147e7; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT "FK_2879f9317daa26218b5915147e7" FOREIGN KEY ("ingredientId") REFERENCES public.ingredient(id);


--
-- Name: recipe_instruction FK_a17aee015c72c3af41ccff64440; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_instruction
    ADD CONSTRAINT "FK_a17aee015c72c3af41ccff64440" FOREIGN KEY ("instructionId") REFERENCES public.instruction(id);


--
-- Name: recipe_instruction FK_b97932a85c9c7dfb3e7876d012d; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.recipe_instruction
    ADD CONSTRAINT "FK_b97932a85c9c7dfb3e7876d012d" FOREIGN KEY ("recipeId") REFERENCES public.recipe(id) ON DELETE CASCADE;


--
-- Name: favorite_recipe FK_d524a2dbf8c0f60f0350eb79601; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.favorite_recipe
    ADD CONSTRAINT "FK_d524a2dbf8c0f60f0350eb79601" FOREIGN KEY ("recipeId") REFERENCES public.recipe(id) ON DELETE CASCADE;


--
-- Name: favorite_recipe FK_fa39803bd1f7221421d1b70f73f; Type: FK CONSTRAINT; Schema: public; Owner: mariam_recipes
--

ALTER TABLE ONLY public.favorite_recipe
    ADD CONSTRAINT "FK_fa39803bd1f7221421d1b70f73f" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


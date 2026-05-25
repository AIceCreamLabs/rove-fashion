export interface Product {
  id:       number;
  slug:     string;
  name:     string;
  price:    string;
  category: string;
  season:   string;
  material: string;
  cut:      string;
  fit:      string;
  desc:     string;
  details:  string[];
  sizes:    string[];
  img:      string;   // cylinder image  (./img/img1.webp …)
  imgs:     string[]; // editorial shots
  gender:   'men' | 'women';
}

// The 12 images already in /public/img/
const I = (n: number) => `./img/img${n}.webp`;

export const PRODUCTS: Product[] = [
  {
    id: 1, slug: 'structured-overcoat',
    name: 'STRUCTURED OVERCOAT', price: '£1,840',
    category: 'Outerwear', season: 'AW25', gender: 'men',
    material: 'Boiled Wool / Cashmere',
    cut: 'Oversized, dropped shoulders', fit: 'True to size',
    desc: 'A monument in cloth. The overcoat questions where the body stops and architecture begins.',
    details: ['Double-faced boiled wool', 'Cashmere lining', 'Hidden press-stud front', 'Raw cut hem', 'Made in England'],
    sizes: ['XS','S','M','L','XL'],
    img: I(1), imgs: [I(1), I(2), I(3)],
  },
  {
    id: 2, slug: 'dissolution-trousers',
    name: 'DISSOLUTION TROUSERS', price: '£640',
    category: 'Trousers', season: 'AW25', gender: 'men',
    material: 'Wool Gabardine',
    cut: 'Pleated, wide-leg', fit: 'Relaxed. Model wears 32.',
    desc: 'Four knife pleats at the front. The leg opens like a question asked slowly.',
    details: ['Italian wool gabardine', 'Four knife pleats', 'Belt loops + hook closure', 'Flat hem', 'Made in Italy'],
    sizes: ['28','30','32','34','36'],
    img: I(2), imgs: [I(2), I(4), I(5)],
  },
  {
    id: 3, slug: 'void-shirt',
    name: 'VOID SHIRT', price: '£390',
    category: 'Tops', season: 'AW25', gender: 'men',
    material: 'Oxford Cotton',
    cut: 'Boxy, elongated back hem', fit: 'Oversized',
    desc: 'White. The absence of colour as statement. Band collar, no buttons — it slips on.',
    details: ['100% Oxford Cotton', 'Band collar', 'Pull-on construction', 'Extended back hem', 'Made in Portugal'],
    sizes: ['XS','S','M','L','XL','XXL'],
    img: I(3), imgs: [I(3), I(6), I(7)],
  },
  {
    id: 4, slug: 'tension-jacket',
    name: 'TENSION JACKET', price: '£1,240',
    category: 'Outerwear', season: 'AW25', gender: 'men',
    material: 'Double Crepe',
    cut: 'Deconstructed, no lining', fit: 'Slim. Model wears 48.',
    desc: 'The jacket as argument. Unfused, unlined — the fabric makes its own decisions.',
    details: ['Italian double crepe', 'Unfused construction', 'Three exterior pockets', 'No lining', 'Made in Italy'],
    sizes: ['44','46','48','50','52'],
    img: I(4), imgs: [I(4), I(8), I(9)],
  },
  {
    id: 5, slug: 'archive-sweater',
    name: 'ARCHIVE SWEATER', price: '£520',
    category: 'Knitwear', season: 'AW25', gender: 'men',
    material: 'Merino / Mohair',
    cut: 'Dropped shoulder, crew neck', fit: 'Boxy',
    desc: 'The sweater that knows winter. Dense merino ribbing, mohair halo throughout.',
    details: ['70% Merino, 30% Mohair', 'Full-fashioned knit', 'Deep rib at cuffs', 'Garment washed', 'Made in Scotland'],
    sizes: ['XS','S','M','L','XL'],
    img: I(5), imgs: [I(5), I(10), I(11)],
  },
  {
    id: 6, slug: 'ceremony-coat',
    name: 'CEREMONY COAT', price: '£2,100',
    category: 'Outerwear', season: 'AW25', gender: 'men',
    material: 'Melton Wool',
    cut: 'Knee length, peak lapel', fit: 'True to size',
    desc: 'A coat for occasions that have no name yet. Peak lapel, single button, full canvas chest.',
    details: ['English melton wool', 'Full canvas chest', 'Surgeon\'s cuff', 'Hand-sewn lapels', 'Made in England'],
    sizes: ['44','46','48','50','52'],
    img: I(6), imgs: [I(6), I(1), I(12)],
  },
  {
    id: 7, slug: 'negative-pant',
    name: 'NEGATIVE PANT', price: '£480',
    category: 'Trousers', season: 'AW25', gender: 'women',
    material: 'Heavyweight Cotton',
    cut: 'Straight leg, high waist', fit: 'Regular',
    desc: 'Black. High waist. Clean. The trousers worn in the background of every important photograph.',
    details: ['14oz heavyweight cotton', 'High-rise waistband', 'Invisible zip fly', 'No break hem', 'Made in Japan'],
    sizes: ['34','36','38','40','42'],
    img: I(7), imgs: [I(7), I(2), I(5)],
  },
  {
    id: 8, slug: 'form-shirt',
    name: 'FORM SHIRT', price: '£310',
    category: 'Tops', season: 'AW25', gender: 'women',
    material: 'Poplin Cotton',
    cut: 'Oversized, pin-tucked bib front', fit: 'Relaxed',
    desc: 'Seven pin-tucks run from collar to hem. Each one a decision made in cloth.',
    details: ['Egyptian Cotton poplin', 'Seven pin-tucks', 'Covered placket', 'Extended back hem', 'Made in France'],
    sizes: ['XS','S','M','L','XL'],
    img: I(8), imgs: [I(8), I(3), I(6)],
  },
  {
    id: 9, slug: 'presence-blazer',
    name: 'PRESENCE BLAZER', price: '£980',
    category: 'Tailoring', season: 'AW25', gender: 'women',
    material: 'Flannel Wool',
    cut: 'Single-breasted, long body', fit: 'Relaxed',
    desc: 'Grey flannel. Three buttons, worn with two undone. The sort of jacket that does not ask for attention.',
    details: ['Pure flannel wool', 'Half-canvas chest', 'Patch pockets', 'Single vent', 'Made in Italy'],
    sizes: ['36','38','40','42','44'],
    img: I(9), imgs: [I(9), I(4), I(12)],
  },
  {
    id: 10, slug: 'interior-coat',
    name: 'INTERIOR COAT', price: '£1,600',
    category: 'Outerwear', season: 'AW25', gender: 'women',
    material: 'Wool Satin',
    cut: 'Wrap, single tie closure', fit: 'Relaxed',
    desc: 'The lining becomes the exterior. Worn on the outside — the inside of the coat made public.',
    details: ['Italian wool satin', 'Single tie closure', 'Deep hip pockets', 'Cut-on sleeves', 'Made in Italy'],
    sizes: ['XS/S','M/L','XL/XXL'],
    img: I(10), imgs: [I(10), I(1), I(8)],
  },
  {
    id: 11, slug: 'weight-trousers',
    name: 'WEIGHT TROUSERS', price: '£560',
    category: 'Trousers', season: 'AW25', gender: 'women',
    material: 'Ponte Roma',
    cut: 'Straight, elasticated waist', fit: 'True to size',
    desc: 'Ponte Roma, elasticated back waist, clean front. The trousers you reach for first.',
    details: ['Italian Ponte Roma', 'Part-elastic waist', 'Side pockets only', 'Unlined', 'Made in Portugal'],
    sizes: ['XS','S','M','L','XL','XXL'],
    img: I(11), imgs: [I(11), I(7), I(3)],
  },
  {
    id: 12, slug: 'evidence-jacket',
    name: 'EVIDENCE JACKET', price: '£760',
    category: 'Outerwear', season: 'AW25', gender: 'women',
    material: 'Waxed Cotton',
    cut: 'Cropped worker, chest pockets', fit: 'Relaxed',
    desc: 'A jacket that records where it has been. Waxed cotton that marks and stains and softens.',
    details: ['British waxed cotton', 'Two chest patch pockets', 'Brass snap closures', 'Unlined', 'Made in England'],
    img: I(12), imgs: [I(12), I(9), I(2)],
    sizes: ['XS','S','M','L','XL'],
  },
];

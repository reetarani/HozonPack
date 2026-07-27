import ecommerce from "../assets/images/industry/1.jpg";
import pizza from "../assets/images/industry/2.jpg";
import logistics from "../assets/images/industry/3.jpg";
import electronics from "../assets/images/industry/4.jpg";
import pharma from "../assets/images/industry/5.jpg";

const industries = [
  {
    id: 1,
    title: "E-Commerce",
    subtitle: "E-Flute Mailers",
    description: "Lightweight, durable, and cost-effective shipping.",
    image: ecommerce,
    size: "large",
  },
  {
    id: 2,
    title: "FMCG",
    subtitle: "Pizza Boxes",
    description: "Grease-resistant, stackable, and food-safe.",
    image: pizza,
    size: "small",
  },
  {
    id: 3,
    title: "Logistics & Shipping",
    subtitle: "Master Cartons",
    description: "Heavy-duty protection for bulk transport.",
    image: logistics,
    size: "small",
  },
  {
    id: 4,
    title: "Electronics",
    subtitle: "Die-cut Partitions",
    description: "Protective inserts for delicate products.",
    image: electronics,
    size: "medium",
  },
  {
    id: 5,
    title: "Pharmaceuticals",
    subtitle: "Medical Packaging",
    description: "Safe and hygienic packaging solutions.",
    image: pharma,
    size: "medium",
  },
];

export default industries;
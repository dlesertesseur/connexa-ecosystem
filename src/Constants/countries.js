const countries = [
    {
        id: "Argentina",
        name: "Argentina",
        provinces:[
            {
                name: "Buenos Aires",
                id: "AR-B"
            },
            {
                name: "Catamarca",
                id: "AR-K"
            },
            {
                name: "Chaco",
                id: "AR-H"
            },
            {
                name: "Chubut",
                id: "AR-U"
            },
            {
                name: "Ciudad Autónoma de Buenos Aires",
                id: "AR-C"
            },
            {
                name: "Corrientes",
                id: "AR-W"
            },
            {
                name: "Córdoba",
                id: "AR-X"
            },
            {
                name: "Entre Ríos",
                id: "AR-E"
            },
            {
                name: "Formosa",
                id: "AR-P"
            },
            {
                name: "Jujuy",
                id: "AR-Y"
            },
            {
                name: "La Pampa",
                id: "AR-L"
            },
            {
                name: "La Rioja",
                id: "AR-F"
            },
            {
                name: "Mendoza",
                id: "AR-M"
            },
            {
                name: "Misiones",
                id: "AR-N"
            },
            {
                name: "Neuquén",
                id: "AR-Q"
            },
            {
                name: "Río Negro",
                id: "AR-R"
            },
            {
                name: "Salta",
                id: "AR-A"
            },
            {
                name: "San Juan",
                id: "AR-J"
            },
            {
                name: "San Luis",
                id: "AR-D"
            },
            {
                name: "Santa Cruz",
                id: "AR-Z"
            },
            {
                name: "Santa Fe",
                id: "AR-S"
            },
            {
                name: "Santiago del Estero",
                id: "AR-G"
            },
            {
                name: "Tierra del Fuego",
                id: "AR-V"
            },
            {
                name: "Tucumán",
                id: "AR-T"
            }
        ]
    },
    {
        id: "Bolivia",
        name: "Bolivia",
        provinces:[
            {
                name: "Chuquisaca",
                id: "BO-H"
            },
            {
                name: "Cochabamba",
                id: "BO-C"
            },
            {
                name: "El Beni",
                id: "BO-B"
            },
            {
                name: "La Paz",
                id: "BO-L"
            },
            {
                name: "Oruro",
                id: "BO-O"
            },
            {
                name: "Pando",
                id: "BO-N"
            },
            {
                name: "Potosí",
                id: "BO-P"
            },
            {
                name: "Santa Cruz",
                id: "BO-S"
            },
            {
                name: "Tarija",
                id: "BO-T"
            }
        ]
    },
    {
        id: "Brazil",
        name: "Brazil",
        provinces:[
            {
                name: "Acre",
                id: "BR-AC"
            },
            {
                name: "Alagoas",
                id: "BR-AL"
            },
            {
                name: "Amapá",
                id: "BR-AP"
            },
            {
                name: "Amazonas",
                id: "BR-AM"
            },
            {
                name: "Bahia",
                id: "BR-BA"
            },
            {
                name: "Ceará",
                id: "BR-CE"
            },
            {
                name: "Distrito Federal",
                id: "BR-DF"
            },
            {
                name: "Espírito Santo",
                id: "BR-ES"
            },
            {
                name: "Goiás",
                id: "BR-GO"
            },
            {
                name: "Maranhão",
                id: "BR-MA"
            },
            {
                name: "Mato Grosso",
                id: "BR-MT"
            },
            {
                name: "Mato Grosso do Sul",
                id: "BR-MS"
            },
            {
                name: "Minas Gerais",
                id: "BR-MG"
            },
            {
                name: "Paraná",
                id: "BR-PR"
            },
            {
                name: "Paraíba",
                id: "BR-PB"
            },
            {
                name: "Pará",
                id: "BR-PA"
            },
            {
                name: "Pernambuco",
                id: "BR-PE"
            },
            {
                name: "Piauí",
                id: "BR-PI"
            },
            {
                name: "Rio Grande do Norte",
                id: "BR-RN"
            },
            {
                name: "Rio Grande do Sul",
                id: "BR-RS"
            },
            {
                name: "Rio de Janeiro",
                id: "BR-RJ"
            },
            {
                name: "Rondônia",
                id: "BR-RO"
            },
            {
                name: "Roraima",
                id: "BR-RR"
            },
            {
                name: "Santa Catarina",
                id: "BR-SC"
            },
            {
                name: "Sergipe",
                id: "BR-SE"
            },
            {
                name: "São Paulo",
                id: "BR-SP"
            },
            {
                name: "Tocantins",
                id: "BR-TO"
            }
        ]
    },
    {
        id: "Colombia",
        name: "Colombia",
        provinces:[
            {
                name: "Amazonas",
                id: "CO-AMA"
            },
            {
                name: "Antioquia",
                id: "CO-ANT"
            },
            {
                name: "Arauca",
                id: "CO-ARA"
            },
            {
                name: "Atlántico",
                id: "CO-ATL"
            },
            {
                name: "Bolívar",
                id: "CO-BOL"
            },
            {
                name: "Boyacá",
                id: "CO-BOY"
            },
            {
                name: "Caldas",
                id: "CO-CAL"
            },
            {
                name: "Caquetá",
                id: "CO-CAQ"
            },
            {
                name: "Casanare",
                id: "CO-CAS"
            },
            {
                name: "Cauca",
                id: "CO-CAU"
            },
            {
                name: "Cesar",
                id: "CO-CES"
            },
            {
                name: "Chocó",
                id: "CO-CHO"
            },
            {
                name: "Cundinamarca",
                id: "CO-CUN"
            },
            {
                name: "Córdoba",
                id: "CO-COR"
            },
            {
                name: "Distrito Capital de Bogotá",
                id: "CO-DC"
            },
            {
                name: "Guainía",
                id: "CO-GUA"
            },
            {
                name: "Guaviare",
                id: "CO-GUV"
            },
            {
                name: "Huila",
                id: "CO-HUI"
            },
            {
                name: "La Guajira",
                id: "CO-LAG"
            },
            {
                name: "Magdalena",
                id: "CO-MAG"
            },
            {
                name: "Meta",
                id: "CO-MET"
            },
            {
                name: "Nariño",
                id: "CO-NAR"
            },
            {
                name: "Norte de Santander",
                id: "CO-NSA"
            },
            {
                name: "Putumayo",
                id: "CO-PUT"
            },
            {
                name: "Quindío",
                id: "CO-QUI"
            },
            {
                name: "Risaralda",
                id: "CO-RIS"
            },
            {
                name: "San Andrés, Providencia y Santa Catalina",
                id: "CO-SAP"
            },
            {
                name: "Santander",
                id: "CO-SAN"
            },
            {
                name: "Sucre",
                id: "CO-SUC"
            },
            {
                name: "Tolima",
                id: "CO-TOL"
            },
            {
                name: "Valle del Cauca",
                id: "CO-VAC"
            },
            {
                name: "Vaupés",
                id: "CO-VAU"
            },
            {
                name: "Vichada",
                id: "CO-VID"
            }
        ]
    },
    {
        id: "Ecuador",
        name: "Ecuador",
        provinces:[
            {
                name: "Azuay",
                id: "EC-A"
            },
            {
                name: "Bolívar",
                id: "EC-B"
            },
            {
                name: "Carchi",
                id: "EC-C"
            },
            {
                name: "Cañar",
                id: "EC-F"
            },
            {
                name: "Chimborazo",
                id: "EC-H"
            },
            {
                name: "Cotopaxi",
                id: "EC-X"
            },
            {
                name: "El Oro",
                id: "EC-O"
            },
            {
                name: "Esmeraldas",
                id: "EC-E"
            },
            {
                name: "Galápagos",
                id: "EC-W"
            },
            {
                name: "Guayas",
                id: "EC-G"
            },
            {
                name: "Imbabura",
                id: "EC-I"
            },
            {
                name: "Loja",
                id: "EC-L"
            },
            {
                name: "Los Ríos",
                id: "EC-R"
            },
            {
                name: "Manabí",
                id: "EC-M"
            },
            {
                name: "Morona-Santiago",
                id: "EC-S"
            },
            {
                name: "Napo",
                id: "EC-N"
            },
            {
                name: "Orellana",
                id: "EC-D"
            },
            {
                name: "Pastaza",
                id: "EC-Y"
            },
            {
                name: "Pichincha",
                id: "EC-P"
            },
            {
                name: "Santa Elena",
                id: "EC-SE"
            },
            {
                name: "Santo Domingo de los Tsáchilas",
                id: "EC-SD"
            },
            {
                name: "Sucumbíos",
                id: "EC-U"
            },
            {
                name: "Tungurahua",
                id: "EC-T"
            },
            {
                name: "Zamora-Chinchipe",
                id: "EC-Z"
            }
        ]
    },
    {
        id: "Mexico",
        name: "Mexico",
        provinces:[
            {
                name: "Distrito Federal",
                id: "MX-DIF",
                "subdivision": "federal district"
            },
            {
                name: "Aguascalientes",
                id: "MX-AGU",
                "subdivision": "state"
            },
            {
                name: "Baja California",
                id: "MX-BCN",
                "subdivision": "state"
            },
            {
                name: "Baja California Sur",
                id: "MX-BCS",
                "subdivision": "state"
            },
            {
                name: "Campeche",
                id: "MX-CAM",
                "subdivision": "state"
            },
            {
                name: "Chiapas",
                id: "MX-CHP",
                "subdivision": "state"
            },
            {
                name: "Chihuahua",
                id: "MX-CHH",
                "subdivision": "state"
            },
            {
                name: "Coahuila",
                id: "MX-COA",
                "subdivision": "state"
            },
            {
                name: "Colima",
                id: "MX-COL",
                "subdivision": "state"
            },
            {
                name: "Durango",
                id: "MX-DUR",
                "subdivision": "state"
            },
            {
                name: "Guanajuato",
                id: "MX-GUA",
                "subdivision": "state"
            },
            {
                name: "Guerrero",
                id: "MX-GRO",
                "subdivision": "state"
            },
            {
                name: "Hidalgo",
                id: "MX-HID",
                "subdivision": "state"
            },
            {
                name: "Jalisco",
                id: "MX-JAL",
                "subdivision": "state"
            },
            {
                name: "Michoacán",
                id: "MX-MIC",
                "subdivision": "state"
            },
            {
                name: "Morelos",
                id: "MX-MOR",
                "subdivision": "state"
            },
            {
                name: "México",
                id: "MX-MEX",
                "subdivision": "state"
            },
            {
                name: "Nayarit",
                id: "MX-NAY",
                "subdivision": "state"
            },
            {
                name: "Nuevo León",
                id: "MX-NLE",
                "subdivision": "state"
            },
            {
                name: "Oaxaca",
                id: "MX-OAX",
                "subdivision": "state"
            },
            {
                name: "Puebla",
                id: "MX-PUE",
                "subdivision": "state"
            },
            {
                name: "Querétaro",
                id: "MX-QUE",
                "subdivision": "state"
            },
            {
                name: "Quintana Roo",
                id: "MX-ROO",
                "subdivision": "state"
            },
            {
                name: "San Luis Potosí",
                id: "MX-SLP",
                "subdivision": "state"
            },
            {
                name: "Sinaloa",
                id: "MX-SIN",
                "subdivision": "state"
            },
            {
                name: "Sonora",
                id: "MX-SON",
                "subdivision": "state"
            },
            {
                name: "Tabasco",
                id: "MX-TAB",
                "subdivision": "state"
            },
            {
                name: "Tamaulipas",
                id: "MX-TAM",
                "subdivision": "state"
            },
            {
                name: "Tlaxcala",
                id: "MX-TLA",
                "subdivision": "state"
            },
            {
                name: "Veracruz",
                id: "MX-VER",
                "subdivision": "state"
            },
            {
                name: "Yucatán",
                id: "MX-YUC",
                "subdivision": "state"
            },
            {
                name: "Zacatecas",
                id: "MX-ZAC",
                "subdivision": "state"
            }
        ]
    }
]

export {countries}
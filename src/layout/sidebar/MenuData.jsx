const RootMenu = [
    {
        icon: "monitor",
        text: "Dashboard",
        link: "/",
    },
    {
        icon: "archived",
        text: "Master Data",
        active: false,
        subMenu: [
            {
                text: "Jenjang",
                link: "/master-data/jenjang",
            },
            {
                text: "Tingkat",
                link: "/master-data/tingkat",
            },
            {
                text: "Jurusan",
                link: "/master-data/jurusan",
            },
            {
                text: "Tahun Pelajaran",
                link: "/master-data/tahun-pelajaran",
            },
        ],
    },
    {
        icon: "building",
        text: "Data Lembaga",
        active: false,
        subMenu: [
            {
                text: "Daftar Lembaga",
                link: "/data-lembaga",
            },
            {
                text: "Program",
                link: "/data-lembaga/program",
            },
            {
                text: "Rombongan Belajar",
                link: "/data-lembaga/rombongan-belajar",
            },
        ],
    },
    {
        icon: "user-list",
        text: "Data Siswa",
        active: false,
        subMenu: [
            {
                text: "Data Siswa",
                link: "/data-siswa",
            },
            {
                text: "Mutasi",
                active: false,
                subMenu: [
                    {
                        text: "Mutasi Keluar",
                        link: "/data-siswa/mutasi/keluar",
                    },
                    {
                        text: "Mutasi Masuk",
                        link: "/data-siswa/mutasi/masuk",
                    }
                ]
            },
            {
                text: "Akademik",
                active: false,
                subMenu: [
                    {
                        text: "Pindah Kelas",
                        link: "/data-siswa/akademik/pindah-kelas",
                    },
                    {
                        text: "Kenaikan Kelas",
                        link: "/data-siswa/akademik/kenaikan-kelas",
                    },
                    {
                        text: "Kelulusan",
                        link: "/data-siswa/akademik/kelulusan",
                    },
                    {
                        text: "Daftar Alumni",
                        link: "/data-siswa/akademik/daftar-alumni",
                    }
                ]
            }
        ],
    },
    {
        icon: "cc-alt2",
        text: "Keuangan",
        active: false,
        subMenu: [
            {
                text: "Data Rekening",
                link: "/keuangan/data-rekening",
            },
            {
                text: "Item Pembayaran",
                link: "/keuangan/item-pembayaran",
            },
            {
                text: "Transaksi",
                link: "/keuangan/transaksi",
            },
            {
                text: "Tagihan",
                link: "/keuangan/tagihan",
            },
            {
                text: "Potongan",
                link: "/keuangan/potongan",
            },
            {
                text: 'Laporan',
                active: false,
                subMenu: [
                    {
                        text: 'Neraca',
                        link: "/keuangan/laporan/neraca",
                    },
                    {
                        text: 'Arus Kas',
                        link: "/keuangan/laporan/arus-kas",
                    },
                    {
                        text: 'Tagihan',
                        link: "/keuangan/laporan/tagihan",
                    }
                ]
            }
        ]
    },
    {
        icon: "list",
        text: "Data Guru",
        link: "/data-guru",
    },
    {
        icon: "users",
        text: "Data Pengguna",
        link: "/data-pengguna",
    },
];
const DefaultMenu = [
    {
        heading: "Use-case preview",
    },
    {
        icon: "bag",
        text: "E-Commerce Panel",
        link: "/ecommerce/index",
        newTab: true,
    },
    {
        heading: "Dashboards",
    },
    {
        icon: "cart-fill",
        text: "Default",
        link: "/",
    },
    {
        icon: "activity-round-fill",
        text: "Sales",
        link: "/sales",
    },
    {
        icon: "growth-fill",
        text: "Analytics",
        link: "/analytics",
    },
    {
        heading: "Pre-built Pages",
    },
    {
        icon: "tile-thumb-fill",
        text: "Projects",
        subMenu: [
            {
                text: "Project Cards",
                link: "/project-card",
            },
            {
                text: "Project List",
                link: "/project-list",
            },
        ],
    },
    {
        icon: "users-fill",
        text: "User Manage",
        subMenu: [
            {
                text: "User List - Default",
                link: "/user-list-default",
            },
            {
                text: "User List - Regular",
                link: "/user-list-regular",
            },
            {
                text: "User List - Compact",
                link: "/user-list-compact",
            },
            {
                text: "User Details - Regular",
                link: "/user-details-regular/1",
            },
            {
                text: "User Profile - Regular",
                link: "/user-profile-regular",
            },
            {
                text: "User Contact - Card",
                link: "/user-contact-card",
            },
        ],
    },

    {
        icon: "cc-alt2-fill",
        text: "Orders",
        subMenu: [
            {
                text: "Order List - Default",
                link: "/order-list-default",
            },
            {
                text: "Order List - Regular",
                link: "/order-list-regular",
            },
            {
                text: "Order List - Sales",
                link: "/order-list-sales",
            },
        ],
    },
    {
        icon: "file-docs",
        text: "AML / KYCs",
        subMenu: [
            {
                text: "KYC List - Regular",
                link: "/kyc-list-regular",
            },
            {
                text: "KYC Details - Regular",
                link: "/kyc-details-regular/UD01544",
            },
        ],
    },
    {
        icon: "grid-alt-fill",
        text: "Applications",
        subMenu: [
            {
                text: "Messages",
                link: "/app-messages",
            },
            {
                text: "Chats / Messenger",
                link: "/app-chat",
            },
            {
                text: "Inbox / Mail",
                link: "/app-inbox",
            },
            {
                text: "Calendar",
                link: "/app-calender",
            },
            {
                text: "Kanban Board",
                link: "/app-kanban",
            },
            {
                text: "File Manager",
                link: "/app-file-manager",
                badge: "new",
            },
        ],
    },
    {
        icon: "card-view",
        text: "Products",
        subMenu: [
            {
                text: "Product List",
                link: "/product-list",
            },
            {
                text: "Product Card",
                link: "/product-card",
            },
            {
                text: "Product Details",
                link: "/product-details/0",
            },
        ],
    },
    {
        icon: "file-docs",
        text: "Invoice",
        subMenu: [
            {
                text: "Invoice List",
                link: "/invoice-list",
            },
            {
                text: "Invoice Details",
                link: "/invoice-details/1",
            },
        ],
    },
    {
        icon: "view-col",
        text: "Pricing Table",
        link: "/pricing-table",
    },
    {
        icon: "img",
        text: "Image Gallery",
        link: "/image-gallery",
    },
    {
        heading: "Misc Pages",
    },
    {
        icon: "light-fill",
        text: "Auth Pages",
        subMenu: [
            {
                text: "Login / Signin",
                link: "/auth-login",
                newTab: true,
            },
            {
                text: "Register / Signup",
                link: "/auth-register",
                newTab: true,
            },
            {
                text: "Forgot Password",
                link: "/auth-reset",
                newTab: true,
            },
            {
                text: "Success / Confirm",
                link: "/auth-success",
                newTab: true,
            },
        ],
    },
    {
        icon: "files-fill",
        text: "Error Pages",
        subMenu: [
            {
                text: "404 Classic",
                link: "/errors/404-classic",
                newTab: true,
            },
            {
                text: "504 Classic",
                link: "/errors/504-classic",
                newTab: true,
            },
            {
                text: "404 Modern",
                link: "/errors/404-modern",
                newTab: true,
            },
            {
                text: "504 Modern",
                link: "/errors/504-modern",
                newTab: true,
            },
        ],
    },
    {
        icon: "files-fill",
        text: "Other Pages",
        subMenu: [
            {
                text: "Blank / Startup",
                link: "/_blank",
            },
            {
                text: "Faqs / Help",
                link: "/pages/faq",
            },
            {
                text: "Terms / Policy",
                link: "/pages/terms-policy",
            },
            {
                text: "Regular Page - v1",
                link: "/pages/regular-v1",
            },
            {
                text: "Regular Page - v2",
                link: "/pages/regular-v2",
            },
        ],
    },
    {
        heading: "Components",
    },
    {
        icon: "layers-fill",
        text: "Ui Elements",
        subMenu: [
            {
                text: "Alerts",
                link: "/components/alerts",
            },
            {
                text: "Accordions",
                link: "/components/accordions",
            },
            {
                text: "Avatar",
                link: "/components/avatar",
            },
            {
                text: "Badges",
                link: "/components/badges",
            },
            {
                text: "Buttons",
                link: "/components/buttons",
            },
            {
                text: "Button Group",
                link: "/components/button-group",
            },
            {
                text: "Breadcrumbs",
                link: "/components/breadcrumbs",
            },
            {
                text: "Cards",
                link: "/components/cards",
            },
            {
                text: "Carousel",
                link: "/components/carousel",
            },
            {
                text: "Dropdowns",
                link: "/components/dropdowns",
            },
            {
                text: "Modals",
                link: "/components/modals",
            },
            {
                text: "Pagination",
                link: "/components/pagination",
            },
            {
                text: "Popovers",
                link: "/components/popovers",
            },
            {
                text: "Progress",
                link: "/components/progress",
            },
            {
                text: "Spinner",
                link: "/components/spinner",
            },
            {
                text: "Tabs",
                link: "/components/tabs",
            },
            {
                text: "Toast",
                link: "/components/toast",
            },
            {
                text: "Typography",
                link: "/components/typography",
            },
            {
                text: "Tooltips",
                link: "/components/tooltips",
            },
            {
                text: "Utilities",
                subMenu: [
                    {
                        text: "Borders",
                        link: "/components/util-border",
                    },
                    {
                        text: "Colors",
                        link: "/components/util-colors",
                    },
                    {
                        text: "Display",
                        link: "/components/util-display",
                    },
                    {
                        text: "Embeded",
                        link: "/components/util-embeded",
                    },
                    {
                        text: "Flex",
                        link: "/components/util-flex",
                    },
                    {
                        text: "Text",
                        link: "/components/util-text",
                    },
                    {
                        text: "Sizing",
                        link: "/components/util-sizing",
                    },
                    {
                        text: "Spacing",
                        link: "/components/util-spacing",
                    },
                    {
                        text: "Others",
                        link: "/components/util-others",
                    },
                ],
            },
        ],
    },
    {
        icon: "dot-box-fill",
        text: "Crafted Icons",
        subMenu: [
            {
                text: "SVG Icon-Exclusive",
                link: "/svg-icons",
            },
            {
                text: "Nioicon - HandCrafted",
                link: "/nioicon",
            },
        ],
    },
    {
        icon: "table-view-fill",
        text: "Tables",
        subMenu: [
            {
                text: "Basic Tables",
                link: "/table-basic",
            },
            {
                text: "Special Tables",
                link: "/table-special",
            },
            {
                text: "DataTables",
                link: "/table-datatable",
            },
        ],
    },
    {
        icon: "view-group-fill",
        text: "Forms",
        subMenu: [
            {
                text: "Form Elements",
                link: "/components/form-elements",
            },
            {
                text: "Checkbox Radio",
                link: "/components/checkbox-radio",
            },
            {
                text: "Input Group",
                link: "/components/input-group",
            },
            {
                text: "Form Upload",
                link: "/components/form-upload",
            },
            {
                text: "Advanced Controls",
                link: "/components/advanced-control",
            },
            {
                text: "Form Layouts",
                link: "/components/form-layouts",
            },
            {
                text: "Form Validation",
                link: "/components/form-validation",
            },
            {
                text: "Date Time Picker",
                link: "/components/datetime-picker",
            },
            {
                text: "Number Spinner",
                link: "/components/number-spinner",
            },
            {
                text: "noUiSlider",
                link: "/components/nouislider",
            },
            {
                text: "Wizard Basic",
                link: "/components/wizard-basic",
            },
            {
                text: "Rich Editor",
                subMenu: [
                    {
                        text: "Quill",
                        link: "/components/quill",
                    },
                    {
                        text: "Tinymce",
                        link: "/components/tinymce",
                    },
                ],
            },
        ],
    },
    {
        icon: "pie-fill",
        text: "Charts",
        subMenu: [
            {
                text: "Chart Js",
                link: "/charts/chartjs",
            },
            {
                text: "Knobs",
                link: "/charts/knobs",
            },
        ],
    },
    {
        icon: "puzzle",
        text: "Widgets",
        subMenu: [
            {
                text: "Card Widgets",
                link: "/components/widgets/cards",
            },
            {
                text: "Chart Widgets",
                link: "/components/widgets/charts",
            },
            {
                text: "Rating Widgets",
                link: "/components/widgets/rating",
            },
        ],
    },
    {
        icon: "block-over",
        text: "Miscellaneous",
        subMenu: [
            {
                text: "Slick Sliders",
                link: "/components/misc/slick-slider",
            },
            {
                text: "Tree View",
                link: "/components/misc/tree-view",
            },
            {
                text: "React Toastify",
                link: "/components/misc/toastify",
            },
            {
                text: "Sweet Alert",
                link: "/components/misc/sweet-alert",
            },
            {
                text: "React DualListBox",
                link: "/components/misc/dual-list",
            },
            {
                text: "Dnd Kit",
                link: "/components/misc/dnd",
            },
            {
                text: "Google Map",
                link: "/components/misc/map",
            },
        ],
    },
    {
        icon: "tag-alt-fill",
        text: "Email Template",
        link: "/email-template",
    },
];
const EcommerceMenu = [
    {
        icon: "dashboard-fill",
        text: "Dashboard",
        link: "/ecommerce/index",
    },
    {
        icon: "bag-fill",
        text: "Orders",
        link: "/ecommerce/orders",
    },
    {
        icon: "package-fill",
        text: "Products",
        link: "/ecommerce/products",
    },
    {
        icon: "users-fill",
        text: "Customers",
        link: "/ecommerce/customer",
    },
    {
        icon: "chat-fill",
        text: "Support",
        link: "/ecommerce/support",
    },
    {
        icon: "opt-alt-fill",
        text: "Settings",
        link: "/ecommerce/settings",
    },
    {
        icon: "server-fill",
        text: "Integration",
        link: "/ecommerce/integration",
    },
    {
        heading: "Back To",
    },
    {
        icon: "dashlite",
        text: "Main Dashboard",
        link: "/",
    },
    {
        icon: "layers-fill",
        text: "All Components",
        link: "/components",
    },
];
export {RootMenu, DefaultMenu, EcommerceMenu} ;

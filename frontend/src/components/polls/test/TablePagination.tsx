import React from "react";

export const TablePagination = () => (
    <div className="dataTables_paginate paging_simple_numbers">
        <nav aria-label="Navigation dans le tableau">
            <ul className="pagination">
                <li className="page-item">
                    <a
                        className="page-link paginate_button previous"
                        href="#"
                        aria-label="Précédent"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li className="page-item">
                    <a className="page-link paginate_button current" href="#">
                        1
                    </a>
                </li>
                <li className="page-item">
                    <a
                        className="page-link paginate_button next"
                        href="#"
                        aria-label="Suivant"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
);

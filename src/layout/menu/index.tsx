import React, { useEffect, useLayoutEffect, Fragment } from "react";
import classNames from "classnames";
import { NavLink, useLocation } from "react-router";
import { useThemeUpdate } from '@/common/hooks/useThemeContext';
import Icon from "@/components/icon";
import { slideUp, slideDown, getParents } from "@/lib";

interface MenuItem {
    text: string;
    link?: string;
    icon?: string;
    badge?: string;
    newTab?: boolean;
    heading?: string;
    subMenu?: MenuItem[];
    active?: boolean;
}

interface MenuProps {
    data: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ data }) => {
    const themeUpdate = useThemeUpdate();
    const location = useLocation();

    const currentLink = (selector: string) => {
        let elm = document.querySelectorAll(selector);
        elm.forEach((item) => {
            if (!(item instanceof HTMLElement)) return;
            let activeRouterLink = item.classList.contains('active');
            if (activeRouterLink) {
                let parents = getParents(item, `.nk-menu`, 'nk-menu-item');
                parents.forEach(parentElements => {
                    parentElements.classList.add('active', 'current-page');
                    let subItem = parentElements.querySelector(`.nk-menu-wrap`);
                    if (subItem instanceof HTMLElement) {
                        subItem.style.display = "block";
                    }
                })
            } else {
                if (item.parentElement) {
                    item.parentElement.classList.remove('active', 'current-page');
                }
            }
        })
    }

    // dropdown toggle
    const dropdownToggle = (elm: HTMLElement) => {
        let parent = elm.parentElement;
        let nextelm = elm.nextElementSibling;
        if (!parent || !(nextelm instanceof HTMLElement)) return;
        let speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
        if (!parent.classList.contains('active')) {
            parent.classList.add('active');
            slideDown(nextelm, speed);
        } else {
            parent.classList.remove('active');
            slideUp(nextelm, speed);
        }
    }

    // dropdown close siblings
    const closeSiblings = (elm: HTMLElement) => {
        let parent = elm.parentElement;
        if (!parent || !parent.parentElement) return;
        let siblings = parent.parentElement.children;
        Array.from(siblings).forEach(item => {
            if (item instanceof HTMLElement && item !== parent) {
                item.classList.remove('active');
                if (item.classList.contains('has-sub')) {
                    let subitem = item.querySelectorAll(`.nk-menu-wrap`);
                    subitem.forEach(child => {
                        if (child instanceof HTMLElement && child.parentElement) {
                            child.parentElement.classList.remove('active');
                            slideUp(child, 400);
                        }
                    })
                }
            }
        });
    }

    const menuToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        let item = (e.target as HTMLElement).closest(`.nk-menu-toggle`);
        if (item instanceof HTMLElement) {
            dropdownToggle(item);
            closeSiblings(item);
        }
    }

    const routeChange = () => {
        let selector = document.querySelectorAll<HTMLElement>(".nk-menu-link")
        selector.forEach((item) => {
            if (item.classList.contains('active')) {
                closeSiblings(item);
                if (item.parentElement) {
                    item.parentElement.classList.add("active");
                }
            } else {
                if (item.parentElement) {
                    item.parentElement.classList.remove("active");
                }
                currentLink(`.nk-menu-link`);
            }
        })
    }

    useLayoutEffect(() => {
        routeChange();
        themeUpdate.sidebarHide();
    }, [location.pathname])

    useEffect(() => {
        currentLink(`.nk-menu-link`);
        // eslint-disable-next-line
    }, [])


    return (
        <ul className="nk-menu">
            {data.map((item, index) =>
                <Fragment key={index}>
                    {item.heading ? (
                        <li className="nk-menu-heading">
                            <h6 className="overline-title text-primary-alt">{item.heading}</h6>
                        </li>
                    ) : (
                        <li className={classNames({ 'nk-menu-item': true, 'has-sub': item.subMenu })}>
                            {!item.subMenu ? (
                                <NavLink to={item.link || "#"} className="nk-menu-link" target={item.newTab ? '_blank' : undefined}>
                                    {item.icon && <span className="nk-menu-icon">
                                        <Icon name={item.icon} />
                                    </span>}
                                    <span className="nk-menu-text">{item.text}</span>
                                    {item.badge && <span className="nk-menu-badge">{item.badge}</span>}
                                </NavLink>
                            ) : (
                                <>
                                    <a href="#" className="nk-menu-link nk-menu-toggle" onClick={menuToggle}>
                                        {item.icon && <span className="nk-menu-icon">
                                            <Icon name={item.icon} />
                                        </span>}
                                        <span className="nk-menu-text">{item.text}</span>
                                        {item.badge && <span className="nk-menu-badge">{item.badge}</span>}
                                    </a>
                                    <div className="nk-menu-wrap">
                                        <ul className="nk-menu-sub">
                                            {item.subMenu.map((sItem, sIndex) =>
                                                <li className={classNames({ 'nk-menu-item': true, 'has-sub': sItem.subMenu })} key={sIndex}>
                                                    {!sItem.subMenu ? (
                                                        <NavLink to={sItem.link || "#"} className="nk-menu-link" target={sItem.newTab ? '_blank' : undefined}>
                                                            <span className="nk-menu-text">{sItem.text}</span>
                                                            {sItem.badge && <span className="nk-menu-badge">{sItem.badge}</span>}
                                                        </NavLink>
                                                    ) : (
                                                        <>
                                                            <a href="#" className="nk-menu-link nk-menu-toggle" onClick={menuToggle}>
                                                                <span className="nk-menu-text">{sItem.text}</span>
                                                                {sItem.badge && <span className="nk-menu-badge">{sItem.badge}</span>}
                                                            </a>
                                                            <div className="nk-menu-wrap">
                                                                <ul className="nk-menu-sub">
                                                                    {sItem.subMenu.map((s2Item, s2Index) =>
                                                                        <li className={classNames({ 'nk-menu-item': true, 'has-sub': s2Item.subMenu })} key={s2Index}>
                                                                            {!s2Item.subMenu ? (
                                                                                <NavLink to={s2Item.link || "#"} className="nk-menu-link" target={s2Item.newTab ? '_blank' : undefined}>
                                                                                    <span className="nk-menu-text">{s2Item.text}</span>
                                                                                    {s2Item.badge && <span className="nk-menu-badge">{s2Item.badge}</span>}
                                                                                </NavLink>
                                                                            ) : (
                                                                                <>
                                                                                    <a href="#" className="nk-menu-link nk-menu-toggle" onClick={menuToggle}>
                                                                                        <span className="nk-menu-text">{s2Item.text}</span>
                                                                                        {s2Item.badge && <span className="nk-menu-badge">{s2Item.badge}</span>}
                                                                                    </a>
                                                                                    <div className="nk-menu-wrap">
                                                                                        <ul className="nk-menu-sub">
                                                                                            {s2Item.subMenu.map((s3Item, s3Index) =>
                                                                                                <li className="nk-menu-item" key={s3Index}>
                                                                                                    <NavLink to={s3Item.link || "#"} className="nk-menu-link" target={s3Item.newTab ? '_blank' : undefined}>
                                                                                                        <span className="nk-menu-text">{s3Item.text}</span>
                                                                                                        {s3Item.badge && <span className="nk-menu-badge">{s3Item.badge}</span>}
                                                                                                    </NavLink>
                                                                                                </li>
                                                                                            )}
                                                                                        </ul>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </li>
                    )}
                </Fragment>
            )}
        </ul>
    );
};

export default Menu;

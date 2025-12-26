"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavbarClientBehavior() {
  const pathname = usePathname();

  // Collapse navbar whenever the pathname changes (client-side navigation)
  useEffect(() => {
    const collapseEl = document.getElementById("navMenu");
    const toggler = document.querySelector('.navbar-toggler');
    if (!collapseEl) return;

    // Remove bootstrap 'show' to close the menu (works even if bootstrap JS isn't present)
    collapseEl.classList.remove("show");
    if (toggler) toggler.setAttribute("aria-expanded", "false");
  }, [pathname]);

  // Close navbar when any internal nav link is clicked (use capture to catch before navigation)
  useEffect(() => {
    const collapseEl = document.getElementById("navMenu");
    if (!collapseEl) return;

    // Short-lived throttle to ignore click after pointer handling
    let lastHandledToggle = 0;
    const IGNORE_MS = 400;

    const handleDropdownToggle = (anchor, e) => {
      const parentDropdown = anchor.closest('.dropdown');
      if (!parentDropdown) return true;

      const menu = parentDropdown.querySelector('.dropdown-menu');
      const isOpen = parentDropdown.classList.contains('show');

      // Close other open dropdowns
      Array.from(collapseEl.querySelectorAll('.dropdown.show')).forEach((d) => {
        if (d !== parentDropdown) {
          d.classList.remove('show');
          const m = d.querySelector('.dropdown-menu');
          if (m) m.classList.remove('show');
          const toggle = d.querySelector('[data-bs-toggle="dropdown"]');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        parentDropdown.classList.remove('show');
        if (menu) menu.classList.remove('show');
        anchor.setAttribute('aria-expanded', 'false');
      } else {
        parentDropdown.classList.add('show');
        if (menu) menu.classList.add('show');
        anchor.setAttribute('aria-expanded', 'true');
      }

      // mark the last handled time so subsequent click is ignored briefly
      lastHandledToggle = Date.now();

      return false;
    };

    const onPointerDown = (e) => {
      const elem = e.target.closest('a, button');
      if (!elem) return;
      if (!collapseEl.contains(elem)) return;

      const toggler = document.querySelector('.navbar-toggler');
      const togglerVisible = toggler && window.getComputedStyle(toggler).display !== 'none';
      const isDropdownToggle = elem.getAttribute('data-bs-toggle') === 'dropdown' || elem.classList.contains('dropdown-toggle');

      if (isDropdownToggle && togglerVisible) {
        // Prevent the native click from causing focus/hover toggles; handle immediately
        e.preventDefault();
        e.stopPropagation();
        handleDropdownToggle(elem, e);
      }
    };

    const onClick = (e) => {
      const elem = e.target.closest("a, button");
      if (!elem) return;
      // only act on links inside the collapsed menu
      if (!collapseEl.contains(elem)) return;

      const toggler = document.querySelector('.navbar-toggler');
      const togglerVisible = toggler && window.getComputedStyle(toggler).display !== 'none';

      // ignore clicks immediately after we handled pointerdown to avoid double toggle
      if (Date.now() - lastHandledToggle < IGNORE_MS) {
        return;
      }

      // If this is a dropdown toggle, handle opening/closing the submenu on mobile
      const isDropdownToggle = elem.getAttribute('data-bs-toggle') === 'dropdown' || elem.classList.contains('dropdown-toggle');
      if (isDropdownToggle && togglerVisible) {
        e.preventDefault();
        e.stopPropagation();
        handleDropdownToggle(elem, e);
        return;
      }

      if (togglerVisible) {
        collapseEl.classList.remove("show");
        if (toggler) toggler.setAttribute("aria-expanded", "false");
      }
    };

    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

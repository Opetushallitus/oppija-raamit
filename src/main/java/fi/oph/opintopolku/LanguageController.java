package fi.oph.opintopolku;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class LanguageController {
    @GetMapping
    @RequestMapping(value = "/changelanguage")
    public void changeLanguage(HttpServletRequest req, HttpServletResponse resp) {
        Cookie langCookie = new Cookie("i18next", req.getParameter("lang"));
        langCookie.setMaxAge(1800);
        langCookie.setPath("/");
        resp.addCookie(langCookie);
    }
}

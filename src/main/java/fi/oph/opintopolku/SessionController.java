package fi.oph.opintopolku;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
public class SessionController {
    @GetMapping
    @RequestMapping(value = "/shibbolethcheck")
    public void checkShibbolethSession(HttpServletRequest req, HttpServletResponse resp) {
        Cookie loggedInCookie = new Cookie("shibboleth_loggedIn", String.valueOf(hasShibbolethSession(req)));
        loggedInCookie.setMaxAge(60);
        loggedInCookie.setPath("/");
        resp.addCookie(loggedInCookie);
    }

    @GetMapping
    @RequestMapping(value = "/changelanguage")
    public void changeLanguage(HttpServletRequest req, HttpServletResponse resp) {
        Cookie langCookie = new Cookie("i18next", req.getParameter("lang"));
        langCookie.setMaxAge(1800);
        langCookie.setPath("/");
        resp.addCookie(langCookie);
    }

    private boolean hasShibbolethSession(HttpServletRequest req) {
        List<Cookie> cookies = req.getCookies() == null ? Collections.emptyList() : Arrays.asList(req.getCookies());
        return cookies.stream().anyMatch(c -> c.getName().indexOf("_shibsession_") == 0);
    }
}

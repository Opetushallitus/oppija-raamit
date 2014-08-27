package oph;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ShibbolethCheckFilter implements Filter {
    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {
    }

    private boolean checkShibboletSession(Cookie[] cookies) {
        if (cookies != null) {
            for (Cookie cookie: cookies) {
                if (cookie.getName().indexOf("_shibsession_")==0)
                    return true;
            }
        }
        return false;
    }

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain filterChain) throws IOException, ServletException {
        Cookie[] cookies = ((HttpServletRequest)req).getCookies();
        Cookie loggedInCookie = new Cookie("shibboleth_loggedIn", String.valueOf(checkShibboletSession(cookies)));
        loggedInCookie.setMaxAge(60);
        loggedInCookie.setPath("/");
        ((HttpServletResponse)res).addCookie(loggedInCookie);
        filterChain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }
}
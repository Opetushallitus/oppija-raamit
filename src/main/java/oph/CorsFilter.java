package oph;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {
    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain filterChain) throws IOException, ServletException {
        ((HttpServletResponse)res).setHeader("Access-Control-Allow-Origin", "*");
        filterChain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }
}
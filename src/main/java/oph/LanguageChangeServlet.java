package oph;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LanguageChangeServlet extends HttpServlet {

    private static boolean isProd(String host) {
        return "opintopolku.fi".equals(host) || "studieinfo.fi".equals(host) || "studyinfo.fi".equals(host);
    }

    private Cookie makeLangCookie(String name, String value) {
        Cookie i18nextCookie = new Cookie(name, value);
        i18nextCookie.setMaxAge(1800);
        i18nextCookie.setPath("/");
        return i18nextCookie;
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = response.getWriter();
        response.addCookie(makeLangCookie("i18next", request.getParameter("lang")));
        try {
            out.println("ok");
        } finally {
            out.close();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Set language cookie";
    }

}

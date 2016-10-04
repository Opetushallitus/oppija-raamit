package oph;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


public class FrontPropertiesServlet extends HttpServlet {

    private final UrlConfiguration urlConfiguration = UrlConfiguration.getInstance();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/javascript");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        out.print("window.urls.override=" + urlConfiguration.frontPropertiesToJson());
        out.flush();
    }

}

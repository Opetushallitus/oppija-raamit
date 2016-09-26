package oph;

import fi.vm.sade.properties.OphProperties;

import java.nio.file.Paths;

public final class UrlConfiguration extends OphProperties {

    private static final UrlConfiguration instance = new UrlConfiguration();

    private UrlConfiguration() {
        addFiles("/oppija-raamit-oph.properties");
        addOptionalFiles(Paths.get(System.getProperties().getProperty("user.home"),
                "/oph-configuration/common.properties").toString());
    }

    public static UrlConfiguration getInstance() {
        return instance;
    }
}

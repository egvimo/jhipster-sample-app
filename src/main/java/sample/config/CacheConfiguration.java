package sample.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, sample.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, sample.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, sample.domain.User.class.getName());
            createCache(cm, sample.domain.Authority.class.getName());
            createCache(cm, sample.domain.User.class.getName() + ".authorities");
            createCache(cm, sample.domain.Abc.class.getName());
            createCache(cm, sample.domain.Xyz.class.getName());
            createCache(cm, sample.domain.Abc0.class.getName());
            createCache(cm, sample.domain.Abc1.class.getName());
            createCache(cm, sample.domain.Abc2.class.getName());
            createCache(cm, sample.domain.Abc3.class.getName());
            createCache(cm, sample.domain.Abc4.class.getName());
            createCache(cm, sample.domain.Abc5.class.getName());
            createCache(cm, sample.domain.Abc6.class.getName());
            createCache(cm, sample.domain.Abc7.class.getName());
            createCache(cm, sample.domain.Abc8.class.getName());
            createCache(cm, sample.domain.Abc9.class.getName());
            createCache(cm, sample.domain.Abc10.class.getName());
            createCache(cm, sample.domain.Abc11.class.getName());
            createCache(cm, sample.domain.Abc12.class.getName());
            createCache(cm, sample.domain.Abc13.class.getName());
            createCache(cm, sample.domain.Abc14.class.getName());
            createCache(cm, sample.domain.Abc15.class.getName());
            createCache(cm, sample.domain.Abc16.class.getName());
            createCache(cm, sample.domain.Abc17.class.getName());
            createCache(cm, sample.domain.Abc18.class.getName());
            createCache(cm, sample.domain.Abc19.class.getName());
            createCache(cm, sample.domain.Abc20.class.getName());
            createCache(cm, sample.domain.Abc21.class.getName());
            createCache(cm, sample.domain.Abc22.class.getName());
            createCache(cm, sample.domain.Abc23.class.getName());
            createCache(cm, sample.domain.Abc24.class.getName());
            createCache(cm, sample.domain.Abc25.class.getName());
            createCache(cm, sample.domain.Abc26.class.getName());
            createCache(cm, sample.domain.Abc27.class.getName());
            createCache(cm, sample.domain.Abc28.class.getName());
            createCache(cm, sample.domain.Abc29.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}

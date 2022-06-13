package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc21Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc21.class);
        Abc21 abc211 = new Abc21();
        abc211.setId(1L);
        Abc21 abc212 = new Abc21();
        abc212.setId(abc211.getId());
        assertThat(abc211).isEqualTo(abc212);
        abc212.setId(2L);
        assertThat(abc211).isNotEqualTo(abc212);
        abc211.setId(null);
        assertThat(abc211).isNotEqualTo(abc212);
    }
}

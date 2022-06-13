package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc27Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc27.class);
        Abc27 abc271 = new Abc27();
        abc271.setId(1L);
        Abc27 abc272 = new Abc27();
        abc272.setId(abc271.getId());
        assertThat(abc271).isEqualTo(abc272);
        abc272.setId(2L);
        assertThat(abc271).isNotEqualTo(abc272);
        abc271.setId(null);
        assertThat(abc271).isNotEqualTo(abc272);
    }
}

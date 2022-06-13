package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc28Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc28.class);
        Abc28 abc281 = new Abc28();
        abc281.setId(1L);
        Abc28 abc282 = new Abc28();
        abc282.setId(abc281.getId());
        assertThat(abc281).isEqualTo(abc282);
        abc282.setId(2L);
        assertThat(abc281).isNotEqualTo(abc282);
        abc281.setId(null);
        assertThat(abc281).isNotEqualTo(abc282);
    }
}
